import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";

const useExpenseAmt = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expenseAmt, setExpenseAmt] = useState(0);

  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setExpenseAmt(res.data[0].sum);
        userCtx.setExpense(res.data[0].sum);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {}
  };

  //   useEffect(() => {
  //     getExpenseAmt();
  //   }, []); // Empty dependency array to run the effect on initial render

  useEffect(() => {
    if (userCtx.accessToken) {
      getExpenseAmt();
    }
  }, [userCtx.accessToken]);

  return expenseAmt;
  // return userCtx.expense;
};

export default useExpenseAmt;
