const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
} = require("../controllers/users");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/profile/:user_id", getOneUser);
router.post("/u/login", loginUser);
router.post("/u/refresh", refreshUser);

module.exports = router;
