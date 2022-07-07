const { Dm } = require("../models");

const dmData = [
  { message: "hey user ", to: 1, from: 2 },
  { message: "hello user", to: 2, from: 3 },
  { message: "hi user", to: 3, from: 2 },
];

const seedDms = () => Dm.bulkCreate(dmData);

module.exports = seedDms;
