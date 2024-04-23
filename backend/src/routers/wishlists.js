const express = require("express");
const { authUser } = require("../middleware/auth");
const { getAllWishlistsForUser } = require("../controllers/wishlists");
const router = express.Router();

router.get("/wishlists", authUser, getAllWishlistsForUser);

module.exports = router;
