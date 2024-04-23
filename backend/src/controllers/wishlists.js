const pool = require("../db/db");

const getAllWishlistsForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "ok", msg: "admin cannot view wishlists" });
    } else if (req.decoded.role === "user") {
      const wishlists = await pool.query(
        `SELECT * FROM wishlists WHERE user_id=$1`,
        [req.decoded.id]
      );
      res.json(wishlists.rows);
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "get all wishlists for user error" });
  }
};

const createWishlistForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "admin cannot create wishlist" });
    } else if (req.decoded.role === "user") {
      // set wishlist_position to 1 first since unsure how drag and drop works
      await pool.query(
        `INSERT INTO wishlists (wishlist_position, wishlist_item, wishlist_cost, wishlist_store, wishlist_status, user_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          1,
          req.body.wishlist_item,
          req.body.wishlist_cost,
          req.body.wishlist_store,
          "Not yet purchased",
          req.decoded.id,
        ]
      );
      res.json({ status: "ok", msg: "create wishlist for user successful" });
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "create wishlist for user unsuccessful" });
  }
};

module.exports = {
  getAllWishlistsForUser,
  createWishlistForUser,
};
