const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  refreshAdmin,
  deleteAdmin,
  updateAdmin,
  getOneAdmin,
} = require("../controllers/admins");
const { authAdmin } = require("../middleware/auth");
const router = express.Router();

router.put("/a/register", registerAdmin);
router.post("/a/login", loginAdmin);
router.post("/a/refresh", refreshAdmin);
router.delete("/a/delete", authAdmin, deleteAdmin);
router.patch("/a/update", authAdmin, updateAdmin);
router.post("/a/profile", authAdmin, getOneAdmin);

module.exports = router;
