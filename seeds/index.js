const seedUsers = require("./user-seeds");
const seedMessages = require("./message-seeds");
const seedRooms = require("./room-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedRooms();

  await seedUsers();

  await seedMessages();

  process.exit(0);
};

seedAll();
