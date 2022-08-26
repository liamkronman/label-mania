const db = require("../models");
const User = db.user;

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

