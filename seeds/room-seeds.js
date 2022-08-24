const { Room } = require("../models");

const roomdata = [
  { roomName: "General" },
  { roomName: "HTML and CSS" },
  { roomName: "JavaScript" },
  { roomName: "Python" },
  { roomName: "Java" },
  { roomName: "C" },
  { roomName: "C++" },
  { roomName: "CSharp" },
  { roomName: "TypeScript" },
  { roomName: "ObjectiveC" },
  { roomName: "Swift" },
  { roomName: "GoLang" },
  { roomName: "Other" },
];

const seedRooms = () => Room.bulkCreate(roomdata);

module.exports = seedRooms;
