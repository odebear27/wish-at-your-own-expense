const express = require("express");
const {
  getAllExpensesForUser,
  createExpenseForUser,
  deleteExpenseForUser,
  updateExpenseForUser,
  getOneExpenseForUser,
} = require("../controllers/expenses");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/expenses", authUser, getAllExpensesForUser);
router.put("/expenses", authUser, createExpenseForUser);
router.delete("/expenses/:expense_id", authUser, deleteExpenseForUser);
router.patch("/expenses/:expense_id", authUser, updateExpenseForUser);
router.post("/expenses/:expense_id", authUser, getOneExpenseForUser);

module.exports = router;
