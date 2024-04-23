const pool = require("../db/db");

const getAllExpensesForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role == "admin") {
      res.json({ status: "error", msg: "only users have expenses" });
    } else {
      const expenses = await pool.query(
        `SELECT * FROM expenses WHERE user_id = $1`,
        [req.decoded.id]
      );
      res.json(expenses.rows);
    }
  } catch (error) {
    console.error(error.message);
    res.json({ status: "error", msg: "getting all expenses for user error" });
  }
};

module.exports = { getAllExpensesForUser };
