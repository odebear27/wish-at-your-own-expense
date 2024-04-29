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
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-20">
          <div>Have you purchased the item?</div>
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
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CanBuyModal;
