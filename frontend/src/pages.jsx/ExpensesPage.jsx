import React, { useEffect, useContext, useState, useRef } from "react";
import ExpenseAmt from "../components/ExpenseAmt";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import Expense from "../components/Expense";
import useLocalStorage from "../hooks/useLocalStorage";

const ExpensesPage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  const [isAddExpensePressed, setIsAddExpensePressed] = useState(false);
  const [expensecategories, setExpenseCategories] = useState([]);
  const dateRef = useRef();
  const itemRef = useRef();
  const categoryRef = useRef();
  const amtRef = useRef();

  const getAllExpensesForAUser = async () => {
    try {
      const res = await fetchData(
        `/api/expenses`,
        undefined,
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        setExpenses(res.data);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllExpenseCategory = async () => {
    try {
      const res = await fetchData(
        `/api/expenses/category`,
        undefined,
        undefined,
        undefined
      );
      if (res.ok) {
        setExpenseCategories(res.data);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createExpenseForUser = async () => {
    try {
      const body = {
        expense_date: dateRef.current.value,
        expense_item: itemRef.current.value,
        expense_category: categoryRef.current.value,
        expense_amt: parseFloat(amtRef.current.value),
      };
      const res = await fetchData(
        `/api/expenses`,
        "PUT",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        getAllExpensesForAUser();
        setIsAddExpensePressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpenseForUser = async (expense_id) => {
    try {
      const res = await fetchData(
        `/api/expenses/${expense_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        getAllExpensesForAUser();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to format the date
  // const formatDate = (isoDateString) => {
  //   const date = new Date(isoDateString);
  //   const year = date.getFullYear();
  //   // padStart so that for eg, 4 will become 04
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  useEffect(() => {
    if (userCtx.accessToken) {
      getAllExpensesForAUser();
      getAllExpenseCategory();
    }
  }, [userCtx.accessToken]);

  return (
    <div className="mt-16">
      <p>Expenses Page</p>
      <div className="grid grid-cols-6">
        <ExpenseAmt></ExpenseAmt>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <button onClick={() => setIsAddExpensePressed(true)}>
          Add an item
        </button>
      </div>

      <div className="grid grid-cols-6 gap-3">
        <div>Date</div>
        <div>Item</div>
        <div>Category</div>
        <div>Amount</div>
        <div></div>
        <div></div>
      </div>
      {isAddExpensePressed && (
        <div className="grid grid-cols-6 gap-3">
          <input ref={dateRef} type="date"></input>

          <input ref={itemRef} type="text"></input>

          <select ref={categoryRef}>
            {expensecategories.length > 0 &&
              expensecategories.map((expenseCategory) => {
                return <option>{expenseCategory.expense_category}</option>;
              })}
          </select>

          <input ref={amtRef} type="text"></input>

          <button onClick={() => createExpenseForUser()}>Submit</button>
          <button onClick={() => setIsAddExpensePressed(false)}>Cancel</button>
        </div>
      )}
      <div className="grid gap-y-3">
        {expenses.map((expense, idx) => {
          // const formattedDate = formatDate(expense.expense_date);
          return (
            <Expense
              key={idx}
              expense={expense}
              deleteExpenseForUser={deleteExpenseForUser}
              expensecategories={expensecategories}
              getAllExpensesForAUser={getAllExpensesForAUser}
            ></Expense>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesPage;
