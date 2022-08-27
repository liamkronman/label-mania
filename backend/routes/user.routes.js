const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/user/setPeerId", [authJwt.verifyToken], controller.setPeerId);
    app.post("/api/user/requestFriend", [authJwt.verifyToken], controller.requestFriend);
    app.post("/api/user/handleRequest", [authJwt.verifyToken], controller.handleRequest);
    app.post("/api/user/getFriendPeerId", [authJwt.verifyToken], controller.getFriendPeerId);
    app.post("/api/user/searchUser", [authJwt.verifyToken], controller.searchUser);
};