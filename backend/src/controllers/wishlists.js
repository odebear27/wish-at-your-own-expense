const pool = require("../db/db");

const getAllWishlistsForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "ok", msg: "admin cannot view wishlists" });
    } else if (req.decoded.role === "user") {
      const wishlists = await pool.query(
        `SELECT * FROM wishlists WHERE user_id=$1 ORDER BY wishlist_status DESC, wishlist_position ASC, wishlist_cost ASC`,
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
      const { rows } = await pool.query(
        `SELECT COALESCE(max(wishlist_position), 0) AS max FROM wishlists WHERE user_id = $1 AND wishlist_status = $2`,
        [req.decoded.id, "UNPURCHASED"]
      );
      await pool.query(
        `INSERT INTO wishlists (wishlist_position, wishlist_item, wishlist_cost, wishlist_store, wishlist_status, user_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          parseInt(rows[0].max) + 1,
          req.body.wishlist_item,
          req.body.wishlist_cost,
          req.body.wishlist_store,
          "UNPURCHASED",
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
        `SELECT * FROM wishlists WHERE wishlist_id = $1`,
        [req.params.wishlist_id]
      );

      // check if user_id for that wishlist is the user that is logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        await pool.query(
          `DELETE FROM wishlists WHERE user_id=$1 AND wishlist_id = $2`,
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

const updateWishlistForUser = async (req, res) => {
  // check if admin or user
  if (req.decoded.role === "admin") {
    res.json({ status: "error", msg: "admin cannot update wishlist" });
  } else if (req.decoded.role === "user") {
    // find the wishlist using the wishlist_id
    const { rows } = await pool.query(
      `SELECT * FROM wishlists WHERE wishlist_id = $1`,
      [req.params.wishlist_id]
    );

    // check if user_id for that wishlist is the user that logged in
    if (rows[0].user_id != req.decoded.id) {
      res.json({ status: "error", msg: "unauthorised" });
    } else if (rows[0].user_id === req.decoded.id) {
      for (field in req.body) {
        await pool.query(
          `UPDATE wishlists SET ${field} = $1 WHERE user_id = $2 AND wishlist_id = $3`,
          [req.body[field], req.decoded.id, req.params.wishlist_id]
        );
      }
      res.json({ status: "ok", msg: "update wishlist for user successful" });
    }
  }
};

const getOneWishlistForUser = async (req, res) => {
  try {
    // check if admin or user
    if (req.decoded.role === "admin") {
      res.json({ status: "ok", msg: "admin cannot view wishlist" });
    } else if (req.decoded.role === "user") {
      // get the wishlist
      const { rows } = await pool.query(
        `SELECT * FROM wishlists WHERE wishlist_id = $1`,
        [req.params.wishlist_id]
      );
      // check if user_id in the wishlist is the same as the user logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        res.json(rows[0]);
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "get one wishlist for user unsuccessful" });
  }
};

const getAllWishlistStatus = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM wishlist_status`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "get all wishlist status failed" });
  }
};

const getTotalWishlistCostForOneUser = async (req, res) => {
  try {
    // check if admin or user
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "not authorised" });
    } else if (req.decoded.role === "user") {
      const { rows } = await pool.query(
        `SELECT SUM(wishlist_cost) FROM wishlists WHERE user_id = $1 AND wishlist_status = $2`,
        [req.decoded.id, "UNPURCHASED"]
      );
      if (rows.length < 1) {
        res.json({ sum: 0 });
      } else {
        res.json(rows);
      }
    }
  } catch (error) {
    console.error(error);
    res.json({
      status: "error",
      msg: "getting total wishlist cost for one user error",
    });
  }
};

module.exports = {
  getAllWishlistsForUser,
  createWishlistForUser,
  deleteWishlistForUser,
  updateWishlistForUser,
  getOneWishlistForUser,
  getAllWishlistStatus,
  getTotalWishlistCostForOneUser,
};
