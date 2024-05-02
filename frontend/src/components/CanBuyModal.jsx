import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [expense, setExpense] = useState(userCtx.expense);

  const updateWishlistForUser = async (wishlistId) => {
    try {
      const body = {
        wishlist_item: props.wishlistItem,
        wishlist_cost: parseFloat(props.wishlistCost),
        wishlist_store: props.wishlistStore,
        wishlist_status: "PURCHASED",
      };

      const res = await fetchData(
        `/api/wishlists/${wishlistId}`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getWishlistCost();
        props.getAllWishlistForAUser();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data);
        // userCtx.setExpense(res.data[0].sum);
        setExpense(res.data[0].sum);
        return parseFloat(res.data[0].sum);
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

  const createExpenseForUser = async () => {
    try {
      const body = {
        expense_date: new Date(Date.now()).toISOString().split("T")[0],
        expense_item: props.wishlistItem,
        expense_category: "OTHERS",
        expense_amt: parseFloat(props.wishlistCost),
      };
      const res = await fetchData(
        `/api/expenses`,
        "PUT",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        // props.getAllExpensesForAUser();
        getExpenseAmt();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wishlistBought = () => {
    updateWishlistForUser(props.wishlistId);
    createExpenseForUser();
    props.getUserProfileAndBudget();
    getExpenseAmt();
    console.log("budget ", userCtx.budget);
    console.log("expense ", expense);
    props.setExcessBudget(
      new Intl.NumberFormat("en-SG", {
        style: "currency",
        currency: "SGD",
      }).format(userCtx.budget - getExpenseAmt())
    );
    props.setCanBuy(false);
    props.setIsCanBuyButtonPressed(false);
  };

  return (
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start mb-20">
          <div className="font-medium">Have you purchased the item?</div>
        </div>
        <div className="flex justify-between">
          <button className="button" onClick={() => wishlistBought()}>
            Yes!!! (remember to add to your expense)
          </button>
          <button
            className="button"
            onClick={() => props.setIsCanBuyButtonPressed(false)}
          >
            No :(
          </button>
        </div>
      </div>
    </div>
  );
};

const CanBuyModal = (props) => {
  const {
    wishlist_id,
    wishlist_item,
    wishlist_cost,
    wishlist_store,
    wishlist_status,
  } = props.wishlist;

  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          setIsCanBuyButtonPressed={props.setIsCanBuyButtonPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          setCanBuy={props.setCanBuy}
          wishlistId={wishlist_id}
          wishlistItem={wishlist_item}
          wishlistCost={wishlist_cost}
          wishlistStatus={wishlist_status}
          getWishlistCost={props.getWishlistCost}
          setExcessBudget={props.setExcessBudget}
          getUserProfileAndBudget={props.getUserProfileAndBudget}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CanBuyModal;
