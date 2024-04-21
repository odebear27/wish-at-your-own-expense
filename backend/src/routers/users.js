const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
} = require("../controllers/users");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/:user_id", getOneUser);

module.exports = router;
