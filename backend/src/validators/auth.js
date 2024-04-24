const { body } = require("express-validator");

const validateUserRegistrationData = [
  body("user_name", "name is required").not().isEmpty(),
  body("user_email", "email is required").not().isEmpty(),
  body("user_email", "valid email is required").isEmail(),
  body("password", "password is required").not().isEmpty(),
  body("password", "password min is 8 and max is 50").isLength({
    min: 8,
    max: 50,
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

module.exports = {
  validateUserRegistrationData,
  validateUserLoginData,
  validateAdminLoginData,
  validateAdminRegistrationData,
  validateRefreshToken,
};
