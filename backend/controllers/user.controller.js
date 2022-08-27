const db = require("../models");
const User = db.user;
const Request = db.request;
const Friendship = db.friendship;
const Sequelize = require('sequelize');
const socketServer = require("../socketServer");
const Op = Sequelize.Op;

exports.setPeerId = (req, res) => {
    User.update({
        peerId: req.body.peerId
    }, {
        where: {
            id: req.userId
        }
    })
    .then(resp => {
        res.send({ message: "Successfully updated peerId!" })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
};

exports.requestFriend = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(userMe => {
        User.findOne({
            where: {
                username: req.body.friendUsername
            }
        })
        .then(futureFriend => {
            Request.create({
                requester: userMe.username,
                requested: futureFriend.username
            })
            .then(request => {
                socketServer.notifyRequest(futureFriend.id, userMe.username);
                res.send({ message: "Request successfully sent!" });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        })
        .catch(err => {
            res.status(500).send({ message: "User to friend not found." });
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
};

exports.handleRequest = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(userMe => {
        Request.findOne({
            where: {
                requester: req.body.potentialFriendUsername,
                requested: userMe.username
            }
        })
        .then(request => {
            Request.destroy({
                where: {
                    id: request.id
                }
            })
            .then(() => {
                if (req.body.accept) {
                    Friendship.create({
                        friend1: req.body.potentialFriendUsername,
                        friend2: userMe.username
                    })
                    .then(() => {
                        res.send({ message: "Friendship successfully created!" });
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message });
                    })
                } else {
                    res.send({ message: "Friendship successfully declined!" });
                }
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        })
        .catch(err => {
            res.status(500).send({ message: "Request not found." });
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
};

exports.getFriendPeerId = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(userMe => {
        Friendship.findOne({
            where: {
                [Op.or]: [
                    {
                        friend1: userMe.username,
                        friend2: req.body.friendUsername
                    },
                    {
                        friend1: req.body.friendUsername,
                        friend2: userMe.username
                    }
                ]
            }
        })
        .then(friendship => {
            if (friendship) {
                User.findOne({
                    where: {
                        username: req.body.friendUsername
                    }
                })
                .then(friend => {
                    res.send({ friendPeerId: friend.peerId });
                })
                .catch(err => {
                    res.status(500).send({ message: "Couldn't find friend." });
                })
            } else {
                res.status(500).send({ message: "Couldn't verify friendship." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Couldn't verify friendship." });
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
};