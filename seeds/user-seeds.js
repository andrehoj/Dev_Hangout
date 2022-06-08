const { User } = require("../models");

const userdata = [
  {
    username: "Andrew",
    password: "secretpass",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "David",
    password: "mydogsname",
    isActive: false,
    currentRoom: 2,
  },
  {
    username: "Timmy",
    password: "secretkey",
    isActive: false,
    currentRoom: 3,
  },
];

const seedUsers = () => User.bulkCreate(userdata);

module.exports = seedUsers;
