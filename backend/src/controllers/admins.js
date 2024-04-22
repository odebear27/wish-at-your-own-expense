const pool = require("../db/db");
const bcrypt = require("bcrypt");

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

module.exports = {
  registerAdmin,
};
