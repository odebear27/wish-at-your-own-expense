const express = require("express");
const {
  getAllExpensesForUser,
  createExpenseForUser,
  deleteExpenseForUser,
} = require("../controllers/expenses");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/expenses", authUser, getAllExpensesForUser);
router.put("/expenses", authUser, createExpenseForUser);
router.delete("/expenses/:expense_id", authUser, deleteExpenseForUser);

module.exports = router;
