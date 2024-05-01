const { body, param } = require("express-validator");

const validateWishlistForUserInput = [
  body("wishlist_item", "wishlist item is required").not().isEmpty(),
  body(
    "wishlist_item",
    "wishlist item must be between length 1-50 characters"
  ).isLength({
    min: 1,
    max: 50,
  }),
  body("wishlist_cost", "wishlist cost is required").not().isEmpty(),
  body("wishlist_cost", "wishlist cost must be a greater than zero").isFloat({
    min: 0.01,
  }),
  body(
    "wishlist_store",
    "wishlist store must be less than 300 characters"
  ).isLength({ max: 300 }),
];

const validateWishlistIdInParams = [
  param("wishlist_id", "wishlist id must be a positive number").isLength({
    min: 1,
  }),
];

module.exports = {
  validateWishlistForUserInput,
  validateWishlistIdInParams,
};
