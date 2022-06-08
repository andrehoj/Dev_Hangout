const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");

class Room extends Model {}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: false,
    modelName: "room",
  }
);

module.exports = Room;
