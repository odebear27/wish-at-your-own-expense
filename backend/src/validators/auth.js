const { body, param } = require("express-validator");

const validateUserRegistrationData = [
  body("user_name", "name is required").not().isEmpty(),
  body("user_email", "email is required").not().isEmpty(),
  body("user_email", "valid email is required").isEmail(),
  body("password", "password is required").not().isEmpty(),
  body("password", "password min is 8 and max is 50").isLength({
    min: 8,
    max: 50,
  }),
  body("budget_amt", "budget amount must be a positive number").isInt({
    min: 0.01,
  }),
];

const validateUserLoginData = [
  body("user_email", "email is required").not().isEmpty().isEmail(),
  body("password", "password is required").not().isEmpty(),
];

const validateAdminRegistrationData = [
  body("admin_name", "name is required").not().isEmpty(),
  body("admin_email", "email is required").not().isEmpty(),
  body("admin_email", "valid email is required").isEmail(),
  body("password", "password is required").not().isEmpty(),
  body("password", "password min is 8 and max is 50").isLength({
    min: 8,
    max: 50,
  }),
];

const validateAdminLoginData = [
  body("admin_email", "email is required").not().isEmpty().isEmail(),
  body("password", "password is required").not().isEmpty(),
];

const validateRefreshToken = [
  body("refresh", "refresh token is required")
    .not()
    .isEmpty()
    .isLength({ min: 1 }),
];

const validateUserIdInParams = [
  param("user_id", "user id must be a positive number").isLength({ min: 1 }),
];

const validateUpdateUserInput = [
  body("user_name", "name must be between 1 to 20 characters").isLength({
    min: 1,
    max: 20,
  }),
];

const validateUpdateUserBudgetInput = [
  body("budget_amt", "budget amount must be a positive number").isLength({
    min: 0.01,
  }),
];

module.exports = {
  validateUserRegistrationData,
  validateUserLoginData,
  validateAdminLoginData,
  validateAdminRegistrationData,
  validateRefreshToken,
  validateUserIdInParams,
  validateUpdateUserInput,
  validateUpdateUserBudgetInput,
};
