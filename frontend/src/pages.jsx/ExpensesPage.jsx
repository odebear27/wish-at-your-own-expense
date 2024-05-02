import React, { useEffect, useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import Expense from "../components/Expense";
import useLocalStorage from "../hooks/useLocalStorage";
import AddExpenseModal from "../components/AddExpenseModal";

const ExpensesPage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  const [isAddExpensePressed, setIsAddExpensePressed] = useState(false);
  const [expensecategories, setExpenseCategories] = useState([]);

  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        userCtx.setExpense(res.data[0].sum);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      }
    } catch (error) {
      console.error(error);
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
      }
    } catch (error) {
      console.error(error);
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
        getExpenseAmt();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) {
      getExpenseAmt();
      getAllExpensesForAUser();
      getAllExpenseCategory();
    }
  }, [userCtx.accessToken]);

  return (
    <div className="mt-16 mx-5 py-6">
      <div className="flex justify-between py-3">
        {userCtx.expense > 0 ? (
          <div className="font-medium">
            Expense amount for current month:{" "}
            {new Intl.NumberFormat("en-SG", {
              style: "currency",
              currency: "SGD",
            }).format(userCtx.expense)}
          </div>
        ) : (
          <div className="font-medium">
            Expense amount for current month: $0
          </div>
        )}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <button onClick={() => setIsAddExpensePressed(true)}>
          <div className="flex space-x-0.5 items-center">
            <span>
              <i className="bi bi-cash-coin h4"></i>
            </span>
            <span className="flex w-16 leading-tight font-medium">
              Add an item
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 h-10 bg-colour-tableHeader items-center">
        <div className="font-medium">Date</div>
        <div className="font-medium">Item</div>
        <div className="font-medium">Category</div>
        <div className="font-medium">Amount</div>
        <div className="font-medium"></div>
        <div className="font-medium"></div>
      </div>
      <hr />
      {isAddExpensePressed && (
        <AddExpenseModal
          expensecategories={expensecategories}
          setIsAddExpensePressed={setIsAddExpensePressed}
          getExpenseAmt={getExpenseAmt}
          getAllExpensesForAUser={getAllExpensesForAUser}
        ></AddExpenseModal>
      )}
      <div className="grid divide-y-[1.3px]">
        {expenses.map((expense, idx) => {
          return (
            <Expense
              key={idx}
              expense={expense}
              deleteExpenseForUser={deleteExpenseForUser}
              expensecategories={expensecategories}
              getAllExpensesForAUser={getAllExpensesForAUser}
              getExpenseAmt={getExpenseAmt}
            ></Expense>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesPage;
