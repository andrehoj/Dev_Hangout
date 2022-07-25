const router = require("express").Router();

const {
  getAllUsers,
  logUserIn,
  getUserById,
  getUsersSession,
  registerUser,
  editUser,
  logUserOut,
  deleteAccount,
  getUserByUsername,
  saveSocket,
  getUserId,
} = require("../../controllers/user-controllers");

router.get("/", getAllUsers);

router.get("/session", getUsersSession);

router.get("/:username", getUserId);

router.get("/userid/:id", getUserById);

router.get("/user-id/:username", getUserByUsername);

router.post("/socket", saveSocket);

router.post("/login", logUserIn);

router.post("/register", registerUser);

router.post("/edit", editUser);

router.post("/logout", logUserOut);

router.delete("/delete-account", deleteAccount);

module.exports = router;
