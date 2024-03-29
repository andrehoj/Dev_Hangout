const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");

class Dm extends Model {}

Dm.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },

    timeOfMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isCodeBlock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },

  {
    sequelize,
    freezeTableName: true,
    underscored: false,
    modelName: "dm",
  }
);

module.exports = Dm;
