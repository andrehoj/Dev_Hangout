const seedUsers = require("./user-seeds");
const seedMessages = require("./message-seeds");
const seedRooms = require("./room-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  console.log("--------------");
  await seedRooms();

  console.log("--------------");
  await seedUsers();

  console.log("--------------");
  await seedMessages();

  process.exit(0);
};

seedAll();
