import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import UpdateWishlistModal from "./UpdateWishlistModal";
import CanBuyModal from "./CanBuyModal";

const Wishlist = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [isUpdateWishlistPressed, setIsUpdateWishlistPressed] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isCanBuyButtonPressed, setIsCanBuyButtonPressed] = useState(false);

  const deleteWishlistForUser = async (wishlist_id) => {
    try {
      const res = await fetchData(
        `/api/wishlists/${wishlist_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log(res.data);
        props.getWishlistCost();
        props.getAllWishlistForAUser();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfCanBuy = () => {
    console.log("budget: ", userCtx.budget);
    console.log("expense: ", userCtx.expense);
    const excessBudget = userCtx.budget - userCtx.expense;
    if (userCtx.budget !== undefined && userCtx.expense !== undefined) {
      console.log("checkpoint");
      console.log("status: ", props.wishlist.wishlist_status);
      console.log("cost: ", props.wishlist.wishlist_cost);
      console.log("excessBudget: ", excessBudget);
      if (
        props.wishlist.wishlist_status === "UNPURCHASED" &&
        excessBudget >= props.wishlist.wishlist_cost
      ) {
        setCanBuy(true);
        console.log("can buy " + props.wishlist.wishlist_item);
      } else {
        setCanBuy(false);
        console.log("too bad " + props.wishlist.wishlist_item);
      }
    }
  };

  useEffect(() => {
    if (
      userCtx.accessToken &&
      userCtx.budget !== undefined &&
      userCtx.expense !== undefined
    ) {
      console.log("i am checking" + props.wishlist.wishlist_item);
      checkIfCanBuy();
    }
  }, [
    userCtx.accessToken,
    userCtx.budget,
    userCtx.expense,
    props.wishlist.wishlist_status,
    props.wishlist.wishlist_cost,
  ]);

  // useEffect(() => {
  //   if (userCtx.accessToken) checkIfCanBuy();
  // }, [userCtx.accessToken]);

  return (
    <div
      style={{
        backgroundColor:
          props.wishlist.wishlist_status === "PURCHASED" ? "#cbdee7" : "",
      }}
      className="pt-1 pb-3"
    >
      {isUpdateWishlistPressed && (
        <UpdateWishlistModal
          wishlist={props.wishlist}
          setIsUpdateWishlistPressed={setIsUpdateWishlistPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          getWishlistCost={props.getWishlistCost}
          checkIfCanBuy={checkIfCanBuy}
        ></UpdateWishlistModal>
      )}
      {isCanBuyButtonPressed && (
        <CanBuyModal
          setIsCanBuyButtonPressed={setIsCanBuyButtonPressed}
          setCanBuy={setCanBuy}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          wishlist={props.wishlist}
          getWishlistCost={props.getWishlistCost}
        ></CanBuyModal>
      )}
      <div className="grid grid-cols-6 gap-3">
        <div>{props.wishlist.wishlist_item}</div>

        <div>
          {" "}
          {new Intl.NumberFormat("en-SG", {
            style: "currency",
            currency: "SGD",
          }).format(props.wishlist.wishlist_cost)}
        </div>
        <div className="col-span-2">{props.wishlist.wishlist_store}</div>
        <div>
          {props.wishlist.wishlist_status === "PURCHASED" ? (
            <div className="flex space-x-2">
              {" "}
              <i class="bi bi-emoji-sunglasses"></i>
              <span>purchased</span>
            </div>
          ) : (
            <div className="flex space-x-2">
              <i class="bi bi-emoji-frown"></i>
              <span>unpurchased</span>
            </div>
          )}
        </div>
        <div className="flex justify-evenly">
          {canBuy ? (
            <button
              onClick={() => setIsCanBuyButtonPressed(true)}
              title="can buy"
            >
              <i class="bi bi-bell-fill"></i>
            </button>
          ) : (
            <div className="w-4"></div>
          )}
          <button
            onClick={() => setIsUpdateWishlistPressed(true)}
            title="update"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            onClick={() => deleteWishlistForUser(props.wishlist.wishlist_id)}
            title="delete"
          >
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
