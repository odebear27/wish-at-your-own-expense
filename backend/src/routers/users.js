const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
  updateUser,
} = require("../controllers/users");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/profile/:user_id", getOneUser);
router.post("/u/login", loginUser);
router.post("/u/refresh", refreshUser);
router.patch("/u/:user_id", authUser, updateUser);

module.exports = router;
