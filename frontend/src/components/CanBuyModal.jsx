import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import ErrorMessage from "../components/ErrorMessage";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [purchasedPrice, setPurchasedPrice] = useState(props.wishlistCost);
  const [message, setMessage] = useState("");

  const updateWishlistForUser = async (wishlistId) => {
    try {
      const body = {
        wishlist_item: props.wishlistItem,
        wishlist_cost: parseFloat(purchasedPrice),
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
      } else {
        if (Array.isArray(res.data)) {
          // res.data is an array
          if (res.data.length > 0) {
            setMessage(res.data[0]);
          }
        } else {
          // or if res.data is a string
          setMessage(res.data);
        }
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
        userCtx.setExpense(res.data[0].sum);
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
        expense_amt: parseFloat(purchasedPrice),
      };
      const res = await fetchData(
        `/api/expenses`,
        "PUT",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getWishlistCost();
        getExpenseAmt();
        props.setCanBuy(false);
        props.setIsCanBuyButtonPressed(false);
      } else {
        if (Array.isArray(res.data)) {
          // res.data is an array
          if (res.data.length > 0) {
            setMessage(res.data[0]);
          }
        } else {
          // or if res.data is a string
          setMessage(res.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wishlistBought = () => {
    updateWishlistForUser(props.wishlistId);
    createExpenseForUser();
    // props.setCanBuy(false);
    // props.setIsCanBuyButtonPressed(false);
  };

  const handleChange = (event) => {
    setPurchasedPrice(event.target.value);
  };

  return (
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-20">
          <div className="font-medium">Have you purchased the item?</div>
          <div className="w-auto flex space-x-4">
            <label>Purchased Price:</label>
            <div className="space-x-1">
              <label>$</label>
              <input
                id="purchasedPrice"
                value={purchasedPrice}
                onChange={handleChange}
                type="text"
              ></input>
            </div>
          </div>
          <ErrorMessage message={message}></ErrorMessage>
        </div>
        <div className="flex justify-between">
          <button className="button" onClick={() => wishlistBought()}>
            Yes!!! (item will be added to your expenses)
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
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CanBuyModal;
