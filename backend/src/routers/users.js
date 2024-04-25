const express = require("express");
const {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
  updateUser,
  deleteUser,
  getOneUserAndBudget,
  updateUserBudget,
} = require("../controllers/users");
const { authUser, authAdmin } = require("../middleware/auth");
const {
  validateUserRegistrationData,
  validateUserLoginData,
  validateRefreshToken,
  validateUserIdInParams,
  validateUpdateUserInput,
  validateUpdateUserBudgetInput,
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
router.post(
  "/u/profile/:user_id",
  authUser,
  authAdmin,
  validateUserIdInParams,
  errorCheck,
  getOneUser
);
router.post("/u/profilebudget", authUser, getOneUserAndBudget);
router.post("/u/login", validateUserLoginData, errorCheck, loginUser);
router.post("/u/refresh", validateRefreshToken, errorCheck, refreshUser);
router.patch(
  "/u/update",
  validateUpdateUserInput,
  errorCheck,
  authUser,
  updateUser
);
router.patch(
  "/u/updatebudget",
  validateUpdateUserBudgetInput,
  errorCheck,
  authUser,
  updateUserBudget
);
router.delete(
  "/u/delete/:user_id",
  authUser,
  authAdmin,
  validateUserIdInParams,
  errorCheck,
  deleteUser
);

module.exports = router;
