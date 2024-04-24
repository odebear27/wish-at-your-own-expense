const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { authUser, authAdmin } = require("../middleware/auth");
const {
  validateUserRegistrationData,
  validateUserLoginData,
  validateRefreshToken,
} = require("../validators/auth");
const { errorCheck } = require("../validators/errorCheck");
const router = express.Router();

router.get("/u", authAdmin, getAllUsers);
router.put(
  "/u/register",
  validateUserRegistrationData,
  errorCheck,
  registerUser
);
router.post("/u/profile/:user_id", authUser, getOneUser);
router.post("/u/login", validateUserLoginData, errorCheck, loginUser);
router.post("/u/refresh", validateRefreshToken, errorCheck, refreshUser);
router.patch("/u/update", authUser, updateUser);
router.delete("/u/delete", authUser, deleteUser);

module.exports = router;
