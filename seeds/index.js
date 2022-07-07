const seedUsers = require("./user-seeds");
const seedRooms = require("./room-seeds");
const seedDms = require("./dm-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedRooms();

  await seedUsers();

  await seedDms();

  console.log("all data seeded!");
  
  process.exit(0);
};

seedAll();
