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
        for (field in req.body) {
          await pool.query(
            `UPDATE expenses SET ${field} = $1 WHERE user_id = $2 AND expense_id=$3`,
            [req.body[field], req.decoded.id, req.params.expense_id]
          );
        }
        res.json({ status: "ok", msg: "update expense for user successful" });
      }
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "update expense for user unsuccessful" });
  }
};

const getOneExpenseForUser = async (req, res) => {
  try {
    // check the role
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "unauthorised" });
    } else if (req.decoded.role === "user") {
      // get the expense
      const { rows } = await pool.query(
        `SELECT * FROM expenses WHERE expense_id = $1`,
        [req.params.expense_id]
      );
      // check if user_id in expense is the user logged in
      if (rows[0].user_id != req.decoded.id) {
        res.json({ status: "error", msg: "unauthorised" });
      } else if (rows[0].user_id === req.decoded.id) {
        const expense = await pool.query(
          `SELECT * FROM expenses WHERE USER_ID = $1 AND expense_id = $2`,
          [req.decoded.id, req.params.expense_id]
        );
        res.json(expense.rows[0]);
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "get one expense for user unsuccessful" });
  }
};

const getAllExpenseCategory = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM expense_category`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "getting all expense category error" });
  }
};

const getTotalExpenseAmtForTheMonthForOneUser = async (req, res) => {
  try {
    // check if admin or user
    if (req.decoded.role === "admin") {
      res.json({ status: "error", msg: "unauthorised" });
    } else if (req.decoded.role === "user") {
      const date = new Date();
      const firstDayOfTheMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );
      const lastDayOfTheMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      );

      const { rows } = await pool.query(
        `SELECT SUM(expense_amt) FROM expenses WHERE user_id = $1 AND expense_date BETWEEN $2 AND $3;`,
        [req.decoded.id, firstDayOfTheMonth, lastDayOfTheMonth]
      );
      res.json(rows);
    }
  } catch (error) {
    console.error(error);
    res.json({
      status: "error",
      msg: "getting total expense amt for the month for one user error",
    });
  }
};

module.exports = {
  getAllExpensesForUser,
  createExpenseForUser,
  deleteExpenseForUser,
  updateExpenseForUser,
  getOneExpenseForUser,
  getAllExpenseCategory,
  getTotalExpenseAmtForTheMonthForOneUser,
};
