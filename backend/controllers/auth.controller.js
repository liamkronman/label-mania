const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
        } else {
            // Save user to Database
            User.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            })
            .then(user => {
                res.send({ message: "User was registered successfully!" });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user.id }, config.secret);

        res.status(200).send({
            id: user.id,
            username: user.username,
            profilePic: user.profilePic,
            accessToken: token
        });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};