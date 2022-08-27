const jwt = require('jsonwebtoken');
const config = require("./config/auth.config.js");
const { Server } = require('socket.io');

module.exports = (server) => {
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
    }).on('connection', (socket) => {
        console.log('socket connected');
    });
};