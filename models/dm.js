const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");

class Dm extends Model {}

Dm.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    to: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    from: {
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
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: false,
    modelName: "dm",
  }
);

module.exports = Dm;
