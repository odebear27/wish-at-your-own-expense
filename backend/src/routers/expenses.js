const express = require("express");
const { getAllExpensesForUser } = require("../controllers/expenses");
const { authUser } = require("../middleware/auth");
const router = express.Router();

router.get("/expenses", authUser, getAllExpensesForUser);

module.exports = router;
