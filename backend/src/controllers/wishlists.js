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

const deleteWishlistForUser = async (req, res) => {
  try {
    // check if USER OR ADMIN
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "admin cannot delete wishlist" });
    } else if (req.decoded.role === "user") {
      // find the wishlist using the wishlist_id
      const { rows } = await pool.query(
        `SELECT * FROM wishlists WHERE wishlist_id=$1`,
        [req.params.wishlist_id]
      );

      // check if user_id for that wishlist is the user that is logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        await pool.query(
          `DELETE FROM wishlists WHERE user_id=$1 AND wishlist_id=$2`,
          [req.decoded.id, req.params.wishlist_id]
        );
        res.json({ status: "ok", msg: "delete wishlist for user successful" });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "delete wishlsit for user unsuccessful" });
  }
};

module.exports = {
  getAllWishlistsForUser,
  createWishlistForUser,
  deleteWishlistForUser,
};
