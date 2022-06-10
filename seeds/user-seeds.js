const { User } = require("../models");

const userdata = [
  {
    username: "Andrew",
    password: "secretpass",
    pfp: "https://robohash.org/Andrew",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "David",
    password: "mydogsname",
    pfp: "https://robohash.org/David",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "Timmy",
    password: "secretkey",
    pfp: "https://robohash.org/Timmy",
    isActive: false,
    currentRoom: 1,
  },
];

const seedUsers = () => User.bulkCreate(userdata, { individualHooks: true });

module.exports = seedUsers;
