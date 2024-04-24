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
const router = express.Router();

router.get("/u", authAdmin, getAllUsers);
router.put("/u/register", registerUser);
router.post("/u/profile/:user_id", authUser, getOneUser);
router.post("/u/login", loginUser);
router.post("/u/refresh", refreshUser);
router.patch("/u/update", authUser, updateUser);
router.delete("/u/delete", authUser, deleteUser);

module.exports = router;
