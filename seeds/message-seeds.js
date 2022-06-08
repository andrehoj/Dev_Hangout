const { Message } = require("../models");

const messagedata = [
  {
    message: "Lorem ipsum dolor sit amet.",
    timeOfMessage: "6/8/2022, 12:06:37 PM",
    userId: 1,
    roomId: 1,
  },
  {
    message: "Lorem ipsum dolor sit amet.",
    timeOfMessage: "6/8/2022, 12:10:37 PM",
    userId: 2,
    roomId: 1,
  },
  {
    message: "Lorem ipsum dolor sit amet.",
    timeOfMessage: "6/8/2022, 12:15:37 PM",
    userId: 3,
    roomId: 1,
  },
  {
    message: "Lorem ipsum dolor sit amet.",
    timeOfMessage: "6/8/2022, 12:06:37 PM",
    userId: 1,
    roomId: 2,
  },
  {
    message: "Lorem ipsum dolor sit amet.",
    timeOfMessage: "6/8/2022, 12:06:37 PM",
    userId: 2,
    roomId: 2,
  },
];

const seedMessages = () => Message.bulkCreate(messagedata);

module.exports = seedMessages;
