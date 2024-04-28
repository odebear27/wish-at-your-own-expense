import React, { useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  //   const createExpenseForUser = async () => {
  //     try {
  //       const body = {
  //         expense_date: dateRef.current.value,
  //         expense_item: props.wishlist_item,
  //         expense_category: categoryRef.current.value,
  //         expense_amt: parseFloat(props.wishlist_cost),
  //       };
  //       const res = await fetchData(
  //         `/api/expenses`,
  //         "PUT",
  //         body,
  //         userCtx.accessToken
  //       );

  //       if (res.ok) {
  //         console.log(res.data);
  //         getAllExpensesForAUser();
  //         setIsAddExpensePressed(false);
  //       } else {
  //         alert(JSON.stringify(res.data));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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
        console.log(res.data);
        // props.checkIfCanBuy();
        props.getAllWishlistForAUser();
        // props.checkIfCanBuy();
        // if (body.wishlist_status === "PURCHASED") {
        //   props.setCanBuy(false);
        // } else {
        //   props.setCanBuy(true);
        // }
        // props.setIsUpdateWishlistPressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wishlistBought = () => {
    updateWishlistForUser(props.wishlistId);
    props.setCanBuy(false);
    props.setIsCanBuyButtonPressed(false);
  };

  return (
    <div>
      <p>Have you purchased the item?</p>
      <button onClick={() => wishlistBought()}>
        Yes!!! (remember to add to your expense)
      </button>
      <button onClick={() => props.setIsCanBuyButtonPressed(false)}>
        No :(
      </button>
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
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CanBuyModal;
