const { Dm } = require("../models");

const dmData = [
  { message: "hey user", receiverId: 1, senderId: 2 },
  { message: "hello user", receiverId: 2, senderId: 3 },
  { message: "hi user", receiverId: 3, senderId: 2 },
];

const seedDms = () => Dm.bulkCreate(dmData);

module.exports = seedDms;
