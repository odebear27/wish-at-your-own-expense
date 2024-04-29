import React, { useState } from "react";
import UpdateExpenseModal from "./UpdateExpenseModal";

const Expense = (props) => {
  const [showUpdateExpenseModal, setShowUpdateExpenseModal] = useState(false);

  // Helper function to format the date
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    // padStart so that for eg, 4 will become 04
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(props.expense.expense_date);
  // const formattedDate = new Date(props.expense.expense_date)
  //   .toISOString()
  //   .split("T")[0];

  return (
    <div>
      {showUpdateExpenseModal && (
        <UpdateExpenseModal
          expense={props.expense}
          expensecategories={props.expensecategories}
          setShowUpdateExpenseModal={setShowUpdateExpenseModal}
          getAllExpensesForAUser={props.getAllExpensesForAUser}
          formatDate={formatDate}
        ></UpdateExpenseModal>
      )}
      <div className="grid grid-cols-6 gap-3">
        <div>{formattedDate}</div>
        <div>{props.expense.expense_item}</div>
        <div>{props.expense.expense_category}</div>
        <div>{props.expense.expense_amt}</div>
        <button onClick={() => setShowUpdateExpenseModal(true)}>update</button>
        <button
          onClick={() => props.deleteExpenseForUser(props.expense.expense_id)}
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default Expense;
