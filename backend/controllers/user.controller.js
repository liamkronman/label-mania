const db = require("../models");
const User = db.user;
const Request = db.request;
const Friendship = db.friendship;

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
                res.send({ message: "Request successfully sent!" });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
}