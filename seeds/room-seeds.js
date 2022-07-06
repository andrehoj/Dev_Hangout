const { Room } = require("../models");

const roomdata = [
  { roomName: "general" },
  { roomName: "javascript" },
  { roomName: "python" },
  { roomName: "java" },
  { roomName: "c" },
  { roomName: "cplusplus" },
  { roomName: "csharp" },
  { roomName: "typescript" },
  { roomName: "objectivec" },
  { roomName: "swift" },
  { roomName: "golang" },
  { roomName: "other" },
];

const seedRooms = () => Room.bulkCreate(roomdata);

module.exports = seedRooms;
