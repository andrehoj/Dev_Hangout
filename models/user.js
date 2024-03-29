const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    pfp: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gitHub: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    favTech: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    favColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5],
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    socketId: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    currentRoom: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "room",
        key: "id",
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);

        var randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const color = "#" + randomColor;

        newUserData.favColor = color;

        return newUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: false,
    modelName: "user",
  }
);

module.exports = User;
