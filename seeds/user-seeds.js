const { User } = require("../models");

const userdata = [
  {
    username: "agent9",
    password: "password",
    pfp: "https://robohash.org/Andrew",
    gitHub: "agenta12",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "Sora",
    password: "password",
    gitHub: "davy john",
    pfp: "https://robohash.org/David",
    isActive: false,
    currentRoom: 1,
  },
  {
    username: "puffyKitten",
    password: "secretkey",
    gitHub: "tim01",
    pfp: "https://robohash.org/Timmy",
    isActive: false,
    currentRoom: 1,
  },
];

const seedUsers = () => User.bulkCreate(userdata, { individualHooks: true });

module.exports = seedUsers;
