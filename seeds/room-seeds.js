const { Room } = require("../models");

const roomdata = [
  { roomName: "General" },
  { roomName: "Javascript" },
  { roomName: "Python" },
  { roomName: "java" },
  { roomName: "C" },
  { roomName: "C++" },
  { roomName: "Csharp" },
  { roomName: "TypeScript" },
  { roomName: "ObjectiveC" },
  { roomName: "Swift" },
  { roomName: "Golang" },
  { roomName: "Other" },
];

const seedRooms = () => Room.bulkCreate(roomdata);

module.exports = seedRooms;
