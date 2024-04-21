const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
} = require("../controllers/users");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/profile/:user_id", getOneUser);
router.post("/u/login", loginUser);

module.exports = router;
