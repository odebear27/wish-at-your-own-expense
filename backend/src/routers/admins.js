const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/admins");
const router = express.Router();

router.put("/a/register", registerAdmin);
router.post("/a/login", loginAdmin);

module.exports = router;
