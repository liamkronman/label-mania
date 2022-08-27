const db = require("../models");
const User = db.user;
const Request = db.request;
const Friendship = db.friendship;
const Sequelize = require('sequelize');
const { notifyRequest } = require("../socketServer");
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
            Request.findOne({
                where: {
                    requester: userMe.username,
                    requested: futureFriend.username
                }
            })
            .then(request => {
                if (!request) {
                    Request.create({
                        requester: userMe.username,
                        requested: futureFriend.username
                    })
                    .then(request => {
                        notifyRequest(futureFriend.id, userMe.username);
                        res.send({ message: "Request successfully sent!" });
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message });
                    })
                } else {
                    res.status(500).send({ message: "Request already exists." })
                }
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

exports.searchUser = (req, res) => {
    User.findOne({
        where: {
            id: req.userId
        }
    })
    .then(userMe => {
        User.findAll({
            where: {
                username: {
                    [Op.like]: '%' + req.body.searchUsername + '%'
                }
            }
        })
        .then(users => {
            let newUsers = [];
            if (users) {
                for (let i = 0; i < users.length; i++) {
                    Friendship.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    friend1: userMe.username,
                                    friend2: users[i]["dataValues"]["username"]
                                },
                                {
                                    friend1: users[i]["dataValues"]["username"],
                                    friend2: userMe.username
                                }
                            ]
                        }
                    })
                    .then(friendship => {
                        if (friendship) {
                            newUsers.push({username: users[i]["dataValues"]["username"], relationStatus: "Friends"});
                            if (newUsers.length === users.length) res.send({users: newUsers});
                        } else {
                            Request.findOne({
                                where: {
                                    requested: userMe.username,
                                    requester: users[i]["dataValues"]["username"]
                                }
                            })
                            .then(request1 => {
                                if (request1) {
                                    newUsers.push({username: users[i]["dataValues"]["username"], relationStatus: "Being requested"});
                                    if (newUsers.length === users.length) res.send({users: newUsers});
                                } else {
                                    Request.findOne({
                                        where: {
                                            requester: userMe.username,
                                            requested: users[i]["dataValues"]["username"]
                                        }
                                    })
                                    .then(request2 => {
                                        if (request2) {
                                            newUsers.push({username: users[i]["dataValues"]["username"], relationStatus: "Requested"});
                                            if (newUsers.length === users.length) res.send({users: newUsers});
                                        } else {
                                            newUsers.push({username: users[i]["dataValues"]["username"], relationStatus: "None"});
                                            if (newUsers.length === users.length) res.send({users: newUsers});
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            } else {
                res.status(500).send({ message: "User not found." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
};