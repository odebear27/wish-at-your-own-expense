const express = require("express");
const { getAllUsers, registerUser } = require("../controllers/users");
const router = express.Router();

router.get("/u", getAllUsers);
router.put("/u/register", registerUser);

module.exports = router;
