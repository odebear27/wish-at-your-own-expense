import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const formattedDate = props.formatDate(props.expenseDate);

  const [expenseToUpdate, setExpenseToUpdate] = useState({
    // expenseDate: new Date(props.expenseDate).toISOString().split("T")[0],
    expenseDate: formattedDate,
    expenseItem: props.expenseItem,
    expenseCategory: props.expenseCategory,
    expenseAmt: props.expenseAmt,
  });

  const handleChange = (event) => {
    setExpenseToUpdate((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  const updateExpenseForUser = async (expense_id) => {
    try {
      const body = {
        expense_date: expenseToUpdate.expenseDate,
        expense_item: expenseToUpdate.expenseItem,
        expense_category: expenseToUpdate.expenseCategory,
        expense_amt: parseFloat(expenseToUpdate.expenseAmt),
      };

      const res = await fetchData(
        `/api/expenses/${expense_id}`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getExpenseAmt();
        props.getAllExpensesForAUser();
        props.setShowUpdateExpenseModal(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-6">
          <div className="font-medium">Update Expense</div>
          <div className="w-auto flex space-x-4">
            <label>Date:</label>
            <input
              id="expenseDate"
              type="date"
              value={expenseToUpdate.expenseDate}
              onChange={handleChange}
            ></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Item:</label>
            <input
              id="expenseItem"
              type="text"
              value={expenseToUpdate.expenseItem}
              onChange={handleChange}
            ></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Category:</label>
            <select
              id="expenseCategory"
              value={expenseToUpdate.expenseCategory}
              onChange={handleChange}
            >
              {props.expensecategories.map((expenseCategory) => {
                return <option>{expenseCategory.expense_category}</option>;
              })}
            </select>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Amount:</label>
            <input
              id="expenseAmt"
              type="text"
              value={expenseToUpdate.expenseAmt}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="button"
            onClick={() => updateExpenseForUser(props.expenseId)}
          >
            submit
          </button>
          <button
            className="button"
            onClick={() => {
              props.setShowUpdateExpenseModal(false);
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateExpenseModal = (props) => {
  const {
    expense_id,
    expense_date,
    expense_item,
    expense_category,
    expense_amt,
  } = props.expense;
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          expenseId={expense_id}
          expenseDate={expense_date}
          expenseItem={expense_item}
          expenseCategory={expense_category}
          expenseAmt={expense_amt}
          expensecategories={props.expensecategories}
          setShowUpdateExpenseModal={props.setShowUpdateExpenseModal}
          getAllExpensesForAUser={props.getAllExpensesForAUser}
          formatDate={props.formatDate}
          getExpenseAmt={props.getExpenseAmt}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateExpenseModal;
