const express = require("express");
const { authUser } = require("../middleware/auth");
const {
  getAllWishlistsForUser,
  createWishlistForUser,
  deleteWishlistForUser,
  updateWishlistForUser,
  getOneWishlistForUser,
  getAllWishlistStatus,
  getTotalWishlistCostForOneUser,
} = require("../controllers/wishlists");
const {
  validateWishlistForUserInput,
  validateWishlistIdInParams,
} = require("../validators/wishlists");
const { errorCheck } = require("../validators/errorCheck");
const router = express.Router();

router.get("/wishlists", authUser, getAllWishlistsForUser);
router.put(
  "/wishlists",
  authUser,
  validateWishlistForUserInput,
  errorCheck,
  createWishlistForUser
);
router.delete(
  "/wishlists/:wishlist_id",
  authUser,
  validateWishlistIdInParams,
  errorCheck,
  deleteWishlistForUser
);
router.patch(
  "/wishlists/:wishlist_id",
  authUser,
  validateWishlistForUserInput,
  validateWishlistIdInParams,
  errorCheck,
  updateWishlistForUser
);
router.post(
  "/wishlists/:wishlist_id",
  authUser,
  validateWishlistIdInParams,
  errorCheck,
  getOneWishlistForUser
);
router.get("/wishlists/status", getAllWishlistStatus);
router.post("/wishlistscost", authUser, getTotalWishlistCostForOneUser);

module.exports = router;
