module.exports = (sequelize, Sequelize, User) => {
    const Friendship = sequelize.define("friendship", {});
    User.hasMany(Friendship, {
        foreignKey: "friend1",
        sourceKey: "username",
        constraints: false,
    });
    User.hasMany(Friendship, {
        foreignKey: "friend2",
        sourceKey: "username",
        constraints: false,
    });
    return Friendship;
}