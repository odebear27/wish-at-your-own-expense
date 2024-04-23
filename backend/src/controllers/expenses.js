const pool = require("../db/db");

const getAllExpensesForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "admin cannot view expenses" });
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

const createExpenseForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "admin cannot create expense" });
    } else {
      await pool.query(
        `INSERT INTO expenses (expense_date, expense_item, expense_category, expense_amt, user_id) VALUES ($1, $2, $3, $4, $5)`,
        [
          req.body.expense_date,
          req.body.expense_item,
          req.body.expense_category,
          req.body.expense_amt,
          req.decoded.id,
        ]
      );
      res.json({ status: "ok", msg: "expense created for user" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "expense creation unsuccessful" });
  }
};

module.exports = { getAllExpensesForUser, createExpenseForUser };
