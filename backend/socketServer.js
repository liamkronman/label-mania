const jwt = require('jsonwebtoken');
const config = require("./config/auth.config.js");
const { Server } = require('socket.io');

const db = require("./models");
const User = db.user;
const Request = db.request;
const Friendship = db.friendship;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const onlineUsers = {};

exports.notifyRequest = (userId, requesterUsername) => {
    if (onlineUsers[userId])
        onlineUsers[userId].emit('friendReq', requesterUsername);
};

exports.notifyFriendAccept = async (username1, username2) => {
    const user1 = await User.findOne({
        where: {
            username: username1
        }
    });
    const user2 = await User.findOne({
        where: {
            username: username2
        }
    });
    if (onlineUsers[user1.id] && onlineUsers[user2.id]) {
        onlineUsers[user1.id].emit('status', { type: 'on', username: username2 });
        onlineUsers[user2.id].emit('status', { type: 'on', username: username1 });
    }
};

exports.socketSetup = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        rejectUnauthorized: false,
    });

    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, config.secret, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        } else next(new Error('Authentication error'));
    }).on('connection', async (socket) => {
        console.log('socket connected');
        const userId = socket.decoded.id;

        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        const incomingReqs = await Request.findAll({
            where: {
                requested: user.username
            }
        });
        const friends = await Promise.all((await Friendship.findAll({
            where: {
                [Op.or]: [
                    {
                        friend1: user.username
                    },
                    {
                        friend2: user.username
                    }
                ]
            }
        })).map(friend => friend.friend1 === user.username ? friend.friend2 : friend.friend1).map(
            async friend => [(await User.findOne({
                where: {
                    username: friend
                }
            })).id, friend]
        ));

        onlineUsers[userId] = socket;

        socket.on('disconnect', () => {
            delete onlineUsers[userId];
            friends.forEach(([friendId]) => {
                if (onlineUsers[friendId])
                    onlineUsers[friendId].emit('status', { type: 'off', username: user.username });
            });
        });

        incomingReqs.forEach(req => socket.emit('friendReq', req.requester));

        friends.forEach(([friendId, friendUsername]) => {
            if (onlineUsers[friendId]) {
                onlineUsers[friendId].emit('status', { type: 'on', username: user.username });
                socket.emit('status', { type: 'on', username: friendUsername });
            } else
                socket.emit('status', { type: 'off', username: friendUsername });
        });
    });
};