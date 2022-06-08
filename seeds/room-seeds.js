const { Room } = require("../models");

const roomdata = [
  { roomName: "general" },
  { roomName: "front-end" },
  { roomName: "back-end" },
  { roomName: "dev-advice" },
];

const seedRooms = () => Room.bulkCreate(roomdata);

module.exports = seedRooms;
