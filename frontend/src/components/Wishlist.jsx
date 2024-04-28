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
        props.getAllWishlistForAUser();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfCanBuy = () => {
    const excessBudget = userCtx.budget - userCtx.expense;
    if (
      props.wishlist.wishlist_status === "NOT YET PURCHASED" &&
      excessBudget > props.wishlist.wishlist_cost
    ) {
      setCanBuy(true);
    }
  };

  useEffect(() => {
    checkIfCanBuy();
  }, []);

  useEffect(() => {
    checkIfCanBuy();
  }, [props.wishlist.wishlist_status]);

  return (
    <div>
      {isUpdateWishlistPressed && (
        <UpdateWishlistModal
          wishlist={props.wishlist}
          setIsUpdateWishlistPressed={setIsUpdateWishlistPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
        ></UpdateWishlistModal>
      )}
      {isCanBuyButtonPressed && (
        <CanBuyModal
          setIsCanBuyButtonPressed={setIsCanBuyButtonPressed}
          setCanBuy={setCanBuy}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          wishlist={props.wishlist}
        ></CanBuyModal>
      )}
      <tr>
        <td>{props.wishlist.wishlist_item}</td>
        <td>{props.wishlist.wishlist_cost}</td>
        <td>{props.wishlist.wishlist_store}</td>
        <td>{props.wishlist.wishlist_status}</td>
        {canBuy && (
          <button onClick={() => setIsCanBuyButtonPressed(true)}>
            Can Buy
          </button>
        )}
        <button onClick={() => setIsUpdateWishlistPressed(true)}>update</button>
        <button
          onClick={() => deleteWishlistForUser(props.wishlist.wishlist_id)}
        >
          delete
        </button>
      </tr>
    </div>
  );
};

export default Wishlist;
