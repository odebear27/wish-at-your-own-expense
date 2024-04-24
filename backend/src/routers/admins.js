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
const {
  validateAdminLoginData,
  validateAdminRegistrationData,
  validateRefreshToken,
} = require("../validators/auth");
const { errorCheck } = require("../validators/errorCheck");
const router = express.Router();

router.put(
  "/a/register",
  validateAdminRegistrationData,
  errorCheck,
  registerAdmin
);
router.post("/a/login", validateAdminLoginData, errorCheck, loginAdmin);
router.post("/a/refresh", validateRefreshToken, errorCheck, refreshAdmin);
router.delete("/a/delete", authAdmin, deleteAdmin);
router.patch("/a/update", authAdmin, updateAdmin);
router.post("/a/profile", authAdmin, getOneAdmin);

module.exports = router;
