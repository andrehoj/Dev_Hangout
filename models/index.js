const User = require("./user");
const Message = require("./message");
const Room = require("./room");
const Dm = require("./dm");

Message.belongsTo(Room, {
  foreignKey: "roomId",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

Message.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(Room, {
  foreignKey: "currentRoom",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Dm.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = { User, Message, Room, Dm };
