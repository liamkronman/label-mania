module.exports = (sequelize, Sequelize, User) => {
    const Request = sequelize.define("request", {});
    User.hasMany(Request, {
        foreignKey: "requester",
        sourceKey: "username",
        constraints: false,
    });
    User.hasMany(Request, {
        foreignKey: "requested",
        sourceKey: "username",
        constraints: false,
    });
    return Request;
}