import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expense, setExpense] = useState({
    date: "",
    item: "",
    category: "FOOD",
    amt: "",
  });

  const createExpenseForUser = async () => {
    try {
      const body = {
        expense_date: expense.date,
        expense_item: expense.item,
        expense_category: expense.category,
        expense_amt: parseFloat(expense.amt),
      };
      const res = await fetchData(
        `/api/expenses`,
        "PUT",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getAllExpensesForAUser();
        props.setIsAddExpensePressed(false);
        props.getExpenseAmt();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setExpense((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  return (
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-6">
          <div className="font-medium">Add Expense</div>
          <div className="w-auto flex space-x-4">
            <label>Date:</label>
            <input
              id="date"
              value={expense.date}
              onChange={handleChange}
              type="date"
              max={new Date(Date.now()).toISOString().split("T")[0]}
            ></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Item:</label>
            <input
              id="item"
              value={expense.item}
              onChange={handleChange}
              type="text"
            ></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Category: </label>
            <select
              id="category"
              value={expense.category}
              onChange={handleChange}
            >
              {props.expensecategories.length > 0 &&
                props.expensecategories.map((expenseCategory, idx) => {
                  return (
                    <option key={idx}>
                      {expenseCategory.expense_category}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="w-auto flex space-x-4">
            <label>Amount:</label>
            <div className="space-x-1">
              <label>$</label>
              <input
                id="amt"
                value={expense.amt}
                onChange={handleChange}
                type="text"
              ></input>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="button" onClick={() => createExpenseForUser()}>
            Submit
          </button>
          <button
            className="button"
            onClick={() => props.setIsAddExpensePressed(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
const AddExpenseModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          expensecategories={props.expensecategories}
          setIsAddExpensePressed={props.setIsAddExpensePressed}
          getExpenseAmt={props.getExpenseAmt}
          getAllExpensesForAUser={props.getAllExpensesForAUser}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddExpenseModal;
