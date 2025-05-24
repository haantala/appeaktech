const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");

// Define the User model (table)
const MediaModel = sequelize.define(
  "media",
  {
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media_expiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    media_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "media",
  }
);

module.exports = MediaModel;
