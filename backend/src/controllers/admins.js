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

const refreshAdmin = async (req, res) => {
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

const deleteAdmin = async (req, res) => {
  try {
    // check if admin_id exists in database
    const { rows } = await pool.query(
      `SELECT admin_id FROM admins WHERE admin_id=$1`,
      [req.decoded.id]
    );
    console.log(rows);
    if (rows.length < 1) {
      res.json({ status: "error", msg: "admin does not exist in database" });
    } else {
      // proceed to delete admin
      await pool.query(`DELETE FROM admins WHERE admin_id=$1`, [
        req.decoded.id,
      ]);
      res.json({ status: "ok", msg: "delete admin successful" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ status: "error", msg: "delete admin unsuccessful" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    if ("admin_name" in req.body)
      await pool.query(
        `UPDATE admins SET admin_name = $1 WHERE admin_id = $2`,
        [req.body.admin_name, req.decoded.id]
      );
    res.json({ status: "ok", msg: "admin updated" });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ status: "error", msg: "update admin failed" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  refreshAdmin,
  deleteAdmin,
  updateAdmin,
};
