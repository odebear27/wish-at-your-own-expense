const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  refreshAdmin,
} = require("../controllers/admins");
const router = express.Router();

router.put("/a/register", registerAdmin);
router.post("/a/login", loginAdmin);
router.post("/a/refresh", refreshAdmin);

module.exports = router;
