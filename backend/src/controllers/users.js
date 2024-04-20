const pool = require("../db/db");

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

module.exports = {
  getAllUsers,
};
