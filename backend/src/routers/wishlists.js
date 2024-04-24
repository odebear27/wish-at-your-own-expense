const express = require("express");
const { authUser } = require("../middleware/auth");
const {
  getAllWishlistsForUser,
  createWishlistForUser,
  deleteWishlistForUser,
  updateWishlistForUser,
  getOneWishlistForUser,
} = require("../controllers/wishlists");
const router = express.Router();

router.get("/wishlists", authUser, getAllWishlistsForUser);
router.put("/wishlists", authUser, createWishlistForUser);
router.delete("/wishlists/:wishlist_id", authUser, deleteWishlistForUser);
router.patch("/wishlists/:wishlist_id", authUser, updateWishlistForUser);
router.post("/wishlists/:wishlist_id", authUser, getOneWishlistForUser);

module.exports = router;
