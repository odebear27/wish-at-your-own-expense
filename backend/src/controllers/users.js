const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    console.log(allUsers.rows);
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
    res.json({ status: "error", msg: "getting all users error" });
  }
};

const registerUser = async (req, res) => {
  try {
    // check for duplicate email first/
    // destructure the rows property from the result object returned by the pool.query function
    const { rows } = await pool.query(
      `SELECT user_email FROM users WHERE user_email = $1`,
      [req.body.user_email]
    );

    // if email exists in database already
    if (rows.length > 0) {
      return res.status(400).json({ status: "error", msg: "duplicate email" });
    }

    const hash = await bcrypt.hash(req.body.user_hash, 12);
    await pool.query(
      `INSERT INTO users (user_name, user_email, user_hash) VALUES ($1, $2, $3)`,
      [req.body.user_name, req.body.user_email, hash]
    );
    res.json({ status: "ok", msg: "user registered" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
};
