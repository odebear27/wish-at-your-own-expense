const express = require("express");
const { authUser } = require("../middleware/auth");
const {
  getAllWishlistsForUser,
  createWishlistForUser,
  deleteWishlistForUser,
} = require("../controllers/wishlists");
const router = express.Router();

router.get("/wishlists", authUser, getAllWishlistsForUser);
router.put("/wishlists", authUser, createWishlistForUser);
router.delete("/wishlists/:wishlist_id", authUser, deleteWishlistForUser);

module.exports = router;
