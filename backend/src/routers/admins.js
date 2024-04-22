const express = require("express");
const { registerAdmin } = require("../controllers/admins");
const router = express.Router();

router.put("/a/register", registerAdmin);

module.exports = router;
