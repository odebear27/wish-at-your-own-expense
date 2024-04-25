const { body, param } = require("express-validator");

const validateExpenseForUserInput = [
  body("expense_date", "expense date is required").not().isEmpty(),
  body("expense_item", "expense item is required").not().isEmpty(),
  body(
    "expense_item",
    "expense item must be between length 1-50 characters"
  ).isLength({
    min: 1,
    max: 50,
  }),
  body("expense_category", "expense category is required").not().isEmpty(),
  body("expense_amt", "expense amt is required").not().isEmpty(),
  body("expense_amt", "expense amt must be a number").isInt({ min: 0 }),
];

const validateExpenseIdInParams = [
  param("expense_id", "expense id must be a positive number").isLength({
    min: 1,
  }),
];

module.exports = {
  validateExpenseForUserInput,
  validateExpenseIdInParams,
};
