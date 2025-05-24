const sequelize = require("../database"); // Importing database connection
const MediaModel = require("./media.model");
const UserModel = require("./user.model");

module.exports = {
  Sequelize: sequelize.constructor,
  sequelize,
  MediaModel,
  UserModel,
};

// // Define associations
// User.hasMany(ActivityModel, { foreignKey: "user_id" });
// ActivityModel.belongsTo(User, { foreignKey: "user_id" });

// User.hasOne(Leaderboard, { foreignKey: "user_id" });
// Leaderboard.belongsTo(User, { foreignKey: "user_id" });
