const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const registerAdmin = async (req, res) => {
  try {
    // check for duplicate email first/
    // destructure the rows property from the result object returned by the pool.query function
    const { rows } = await pool.query(
      `SELECT admin_email FROM admins WHERE admin_email = $1`,
      [req.body.admin_email]
    );

    // if email exists in database already
    if (rows.length > 0) {
      return res.status(400).json({ status: "error", msg: "duplicate email" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);
    await pool.query(
      `INSERT INTO admins (admin_name, admin_email, admin_hash) VALUES ($1, $2, $3)`,
      [req.body.admin_name, req.body.admin_email, hash]
    );
    res.json({ status: "ok", msg: "admin registered" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    // check if admin_email exists in database
    const { rows } = await pool.query(
      `SELECT * FROM admins WHERE admin_email=$1`,
      [req.body.admin_email]
    );

    if (rows.length < 1)
      return res.status(400).json({ status: "error", msg: "login error" });

    // check if password matches
    const result = await bcrypt.compare(req.body.password, rows[0].admin_hash);
    if (!result) {
      console.error(
        "password error in login attempt for admin_email " + rows[0].admin_email
      );
      return res.json(401).json({ status: "error", msg: "login failed" });
    }

    const claims = {
      email: rows[0].admin_email,
      role: "admin",
      id: rows[0].admin_id,
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

module.exports = {
  registerAdmin,
  loginAdmin,
};
