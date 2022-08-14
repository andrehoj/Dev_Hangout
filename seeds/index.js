const seedUsers = require("./user-seeds");
const seedRooms = require("./room-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedRooms();

  await seedUsers();

  console.log("all data seeded!");

  process.exit(0);
};

seedAll();
