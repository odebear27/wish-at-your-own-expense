import React from "react";
import useExpenseAmt from "../hooks/useExpenseAmt";

const ExpenseAmt = () => {
  const expenseAmt = useExpenseAmt();
  return (
    <div>
      {expenseAmt ? <p>My Expenses: ${expenseAmt}</p> : <p>My Expenses: $0</p>}
    </div>
  );
};

export default ExpenseAmt;
