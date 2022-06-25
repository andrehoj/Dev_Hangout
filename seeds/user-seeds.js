const { User } = require("../models");

const userdata = [
  {
    username: "Andrew",
    password: "password",
    pfp: "https://robohash.org/Andrew",
    gitHub: "agenta12",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "David",
    password: "password",
    gitHub: "dav",
    pfp: "https://robohash.org/David",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "Timmy",
    password: "secretkey",
    gitHub: "tim01",
    pfp: "https://robohash.org/Timmy",
    isActive: false,
    currentRoom: 1,
  },
];

const seedUsers = () => User.bulkCreate(userdata, { individualHooks: true });

module.exports = seedUsers;
