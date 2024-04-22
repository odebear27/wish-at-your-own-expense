const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/profile/:user_id", authUser, getOneUser);
router.post("/u/login", loginUser);
router.post("/u/refresh", refreshUser);
router.patch("/u", authUser, updateUser);
router.patch("/u/delete", authUser, deleteUser);

module.exports = router;
