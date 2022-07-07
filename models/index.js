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

// creates a method in the
// user object with getSentMessages, etc.
// allows the use of include with sentMessages
User.hasMany(Dm, {
  as: "sentMessages",
  foreignKey: "senderId",
});

User.hasMany(Dm, {
  as: "receivedMessages",
  foreignKey: "receiverId",
});

// creates a method in the
// message object that has a user - the sender of the message
Dm.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
});

Dm.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiverId",
});

module.exports = { User, Message, Room, Dm };
