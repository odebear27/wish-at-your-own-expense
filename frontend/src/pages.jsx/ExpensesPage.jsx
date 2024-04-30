import React, { useEffect, useContext, useState, useRef } from "react";
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

  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("sum" + res.data);
        // setExpenseAmt(res.data[0].sum);
        userCtx.setExpense(res.data[0].sum);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {}
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
        getExpenseAmt();
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
        getExpenseAmt();
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

  // useEffect(() => {
  //   getExpenseAmt();
  // }, []); // Empty dependency array to run the effect on initial render

  // useEffect(() => {
  //   if (userCtx.accessToken) {
  //     getExpenseAmt();
  //   }
  // }, [userCtx.accessToken]);

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
            <i class="bi bi-cash-coin"></i>
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
        <div className="grid grid-cols-5 gap-3">
          <input
            ref={dateRef}
            type="date"
            max={new Date(Date.now()).toISOString().split("T")[0]}
          ></input>

          <input ref={itemRef} type="text"></input>

          <select ref={categoryRef}>
            {expensecategories.length > 0 &&
              expensecategories.map((expenseCategory) => {
                return <option>{expenseCategory.expense_category}</option>;
              })}
          </select>

          <input ref={amtRef} type="text"></input>
          <div className="flex justify-evenly">
            <button onClick={() => createExpenseForUser()}>Submit</button>
            <button onClick={() => setIsAddExpensePressed(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="grid divide-y-[1.3px]">
        {expenses.map((expense, idx) => {
          // const formattedDate = formatDate(expense.expense_date);
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
