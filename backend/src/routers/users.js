const express = require("express");
const { getAllUsers } = require("../controllers/users");
const router = express.Router();

router.get("/u", getAllUsers);

module.exports = router;
