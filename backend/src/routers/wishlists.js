const express = require("express");
const { authUser } = require("../middleware/auth");
const {
  getAllWishlistsForUser,
  createWishlistForUser,
} = require("../controllers/wishlists");
const router = express.Router();

router.get("/wishlists", authUser, getAllWishlistsForUser);
router.put("/wishlists", authUser, createWishlistForUser);

module.exports = router;
