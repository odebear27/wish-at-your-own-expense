const express = require("express");
const {
  getAllExpensesForUser,
  createExpenseForUser,
  deleteExpenseForUser,
  updateExpenseForUser,
  getOneExpenseForUser,
  getAllExpenseCategory,
  getTotalExpenseAmtForTheMonthForOneUser,
} = require("../controllers/expenses");
const { authUser } = require("../middleware/auth");
const {
  validateExpenseForUserInput,
  validateExpenseIdInParams,
} = require("../validators/expenses");
const { errorCheck } = require("../validators/errorCheck");
const router = express.Router();

router.get("/expenses", authUser, getAllExpensesForUser);
router.put(
  "/expenses",
  authUser,
  validateExpenseForUserInput,
  errorCheck,
  createExpenseForUser
);
router.delete(
  "/expenses/:expense_id",
  authUser,
  validateExpenseIdInParams,
  errorCheck,
  deleteExpenseForUser
);
router.patch(
  "/expenses/:expense_id",
  authUser,
  validateExpenseForUserInput,
  validateExpenseIdInParams,
  errorCheck,
  updateExpenseForUser
);
router.post(
  "/expenses/:expense_id",
  authUser,
  validateExpenseIdInParams,
  errorCheck,
  getOneExpenseForUser
);
router.get("/expenses/category", getAllExpenseCategory);
router.post("/expensesamt", authUser, getTotalExpenseAmtForTheMonthForOneUser);

module.exports = router;
