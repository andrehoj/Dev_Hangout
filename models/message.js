const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeOfMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: "room",
        key: "id",
      },
    },
  },

  {
    sequelize,
    freezeTableName: true,
    underscored: false,
    modelName: "message",
  }
);

module.exports = Message;
