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
  getUserId,
} = require("../../controllers/user-controllers");

router.get("/user-id/:username", getUserId);

router.get("/", getAllUsers);

router.get("/session", getUsersSession);

router.get("/:id", getUserById);

router.post("/login", logUserIn);

router.post("/register", registerUser);

router.post("/edit", editUser);

router.post("/logout", logUserOut);

router.delete("/delete-account", deleteAccount);

module.exports = router;
