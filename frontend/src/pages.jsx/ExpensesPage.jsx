import React, { useEffect, useContext, useState } from "react";
import ExpenseAmt from "../components/ExpenseAmt";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const ExpensesPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);

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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllExpensesForAUser();
  }, []);

  return (
    <div>
      <p>Expenses Page</p>
      <ExpenseAmt></ExpenseAmt>
      <button>Add an item</button>
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
            return (
              <tr>
                <td>{expense.expense_date.slice(0, 10)}</td>
                <td>{expense.expense_item}</td>
                <td>{expense.expense_category}</td>
                <td>{expense.expense_amt}</td>
                <button>update</button>
                <button>delete</button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesPage;
