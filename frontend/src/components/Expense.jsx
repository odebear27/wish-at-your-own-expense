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

  return (
    <div className="pt-1 pb-3">
      {showUpdateExpenseModal && (
        <UpdateExpenseModal
          expense={props.expense}
          expensecategories={props.expensecategories}
          setShowUpdateExpenseModal={setShowUpdateExpenseModal}
          getAllExpensesForAUser={props.getAllExpensesForAUser}
          formatDate={formatDate}
          getExpenseAmt={props.getExpenseAmt}
        ></UpdateExpenseModal>
      )}
      <div className="grid grid-cols-5 gap-3">
        <div>{formattedDate}</div>
        <div>{props.expense.expense_item}</div>
        <div>{props.expense.expense_category}</div>
        <div>
          {" "}
          {new Intl.NumberFormat("en-SG", {
            style: "currency",
            currency: "SGD",
          }).format(props.expense.expense_amt)}
        </div>
        <div className="flex justify-evenly">
          <button
            onClick={() => setShowUpdateExpenseModal(true)}
            title="update"
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            onClick={() => props.deleteExpenseForUser(props.expense.expense_id)}
            title="delete"
          >
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expense;
