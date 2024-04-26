import React, { useEffect, useContext, useState, useRef } from "react";
import ExpenseAmt from "../components/ExpenseAmt";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const ExpensesPage = () => {
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
        console.log(res.data);
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
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data);
        setExpenseCategories(res.data);
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
        console.log(res.data);
        getAllExpensesForAUser();
        setIsAddExpensePressed(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function to format the date
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    // padStart so that for eg, 4 will become 04
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getAllExpensesForAUser();
    getAllExpenseCategory();
  }, []);

  return (
    <div>
      <p>Expenses Page</p>
      <ExpenseAmt></ExpenseAmt>
      <button onClick={() => setIsAddExpensePressed(true)}>Add an item</button>
      {/* {JSON.stringify(expenses)} */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const formattedDate = formatDate(expense.expense_date);
            return (
              <tr>
                <td>{formattedDate}</td>
                <td>{expense.expense_item}</td>
                <td>{expense.expense_category}</td>
                <td>{expense.expense_amt}</td>
                <button>update</button>
                <button>delete</button>
              </tr>
            );
          })}
          {isAddExpensePressed && (
            <tr>
              <td>
                <input ref={dateRef} type="date"></input>
              </td>
              <td>
                <input ref={itemRef} type="text"></input>
              </td>
              <td>
                <select ref={categoryRef}>
                  {expensecategories.map((expenseCategory) => {
                    return <option>{expenseCategory.expense_category}</option>;
                  })}
                </select>
              </td>
              <td>
                <input ref={amtRef} type="text"></input>
              </td>
              <td>
                <button onClick={() => createExpenseForUser()}>Submit</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesPage;
