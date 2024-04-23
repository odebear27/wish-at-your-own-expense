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

const deleteExpenseForUser = async (req, res) => {
  try {
    // check if user or admin
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "unauthorised" });
    } else if (req.decoded.role === "user") {
      // find the expense using the expense_id
      const { rows } = await pool.query(
        `SELECT * FROM expenses WHERE expense_id=$1`,
        [req.params.expense_id]
      );

      // check if user_id for that expense is the user that logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        await pool.query(
          `DELETE FROM expenses WHERE user_id=$1 AND expense_id=$2`,
          [req.decoded.id, req.params.expense_id]
        );
        res.json({ status: "ok", msg: "expense deleted for user" });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "delete expense for user unsuccessful" });
  }
};

const updateExpenseForUser = async (req, res) => {
  try {
    // check if user or admin
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "unauthorised" });
    } else if (req.decoded.role === "user") {
      // find the expense using the expense_id
      const { rows } = await pool.query(
        `SELECT * FROM expenses WHERE expense_id = $1`,
        [req.params.expense_id]
      );
      // check if user_id for that expense is the user that logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        if ("expense_date" in req.body)
          await pool.query(
            `UPDATE expenses SET expense_date = $1 WHERE user_id = $2 AND expense_id=$3`,
            [req.body.expense_date, req.decoded.id, req.params.expense_id]
          );
        if ("expense_item" in req.body)
          await pool.query(
            `UPDATE expenses SET expense_item = $1 WHERE  user_id = $2 AND expense_id=$3`,
            [req.body.expense_item, req.decoded.id, req.params.expense_id]
          );
        if ("expense_category" in req.body)
          await pool.query(
            `UPDATE expenses SET expense_category = $1 WHERE user_id = $2 AND expense_id=$3`,
            [req.body.expense_category, req.decoded.id, req.params.expense_id]
          );
        if ("expense_amt" in req.body)
          await pool.query(
            `UPDATE expenses SET expense_amt = $1 WHERE user_id = $2 AND expense_id=$3`,
            [req.body.expense_amt, req.decoded.id, req.params.expense_id]
          );
        res.json({ status: "ok", msg: "update expense for user successful" });
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "update expense for user unsuccessful" });
  }
};

module.exports = {
  getAllExpensesForUser,
  createExpenseForUser,
  deleteExpenseForUser,
  updateExpenseForUser,
};
