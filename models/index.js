const User = require("./user");
const Message = require("./message");
const Room = require("./room");

Message.belongsTo(Room, {
  foreignKey: "roomId",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

Message.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

User.belongsTo(Room, {
  foreignKey: "currentRoom",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

module.exports = { User, Message, Room };
