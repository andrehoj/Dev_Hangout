const { Room } = require("../models");

const roomdata = [
  { roomName: "General" },
  { roomName: "HTML" },
  { roomName: "CSS" },
  { roomName: "JavaScript" },
  { roomName: "Python" },
  { roomName: "Java" },
  { roomName: "C" },
  { roomName: "C++" },
  { roomName: "TypeScript" },
  { roomName: "GoLang" },
  { roomName: "Other" },
];

const seedRooms = () => Room.bulkCreate(roomdata);

module.exports = seedRooms;
