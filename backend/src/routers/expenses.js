const express = require("express");
const {
  getAllExpensesForUser,
  createExpenseForUser,
} = require("../controllers/expenses");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/expenses", authUser, getAllExpensesForUser);
router.put("/expenses", authUser, createExpenseForUser);

module.exports = router;
