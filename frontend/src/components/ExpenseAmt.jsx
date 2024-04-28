import React, { useContext } from "react";
import useExpenseAmt from "../hooks/useExpenseAmt";
import UserContext from "../context/user";

const ExpenseAmt = () => {
  const userCtx = useContext(UserContext);
  const expenseAmt = useExpenseAmt();
  // Using userCtx here so that can access in Wishlist
  userCtx.setExpense(expenseAmt);

  return (
    <div>
      {expenseAmt ? <p>My Expenses: ${expenseAmt}</p> : <p>My Expenses: $0</p>}
      {/* {userCtx.expense ? (
        <p>My Expenses: ${userCtx.expense}</p>
      ) : (
        <p>My Expenses: $0</p>
      )} */}
    </div>
  );
};

export default ExpenseAmt;
