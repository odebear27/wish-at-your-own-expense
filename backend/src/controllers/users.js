const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query(`SELECT * FROM users`);
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

    const hash = await bcrypt.hash(req.body.password, 12);
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

const getOneUser = async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
      req.params.user_id,
    ]);

    if (user.rows.length > 0) {
      res.json(user.rows);
    } else {
      res.json({ status: "error", msg: "user_id does not exist in database" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "getting one user error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // check if user_email exists in database
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE user_email = $1`,
      [req.body.user_email]
    );
    if (rows.length < 1)
      return res.status(400).json({ status: "error", msg: "login error" });

    // check if password matches
    const result = await bcrypt.compare(req.body.password, rows[0].user_hash);
    if (!result) {
      console.error(
        "password error in login attempt for user_email " + rows[0].user_email
      );
      return res.json(401).json({ status: "error", msg: "login failed" });
    }

    const claims = {
      email: rows[0].user_email,
      role: "user",
      id: rows[0].user_id,
    };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ status: "error", msg: "login failed" });
  }
};

const refreshUser = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = {
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token failed" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  getOneUser,
  loginUser,
  refreshUser,
};
