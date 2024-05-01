import React, { useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

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
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CanBuyModal;
