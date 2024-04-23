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

module.exports = {
  getAllWishlistsForUser,
};
