import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [allWishlistStatus, setAllWishlistStatus] = useState([]);
  const [updateWishlist, setUpdateWishlist] = useState({
    wishlistItem: props.wishlistItem,
    wishlistCost: props.wishlistCost,
    wishlistStore: props.wishlistStore,
    wishlistStatus: props.wishlistStatus,
  });

  const getAllWishlistStatus = async () => {
    try {
      const res = await fetchData(
        `/api/wishlists/status`,
        undefined,
        undefined,
        undefined
      );
      if (res.ok) {
        console.log(res.data);
        setAllWishlistStatus(res.data);
      } else {
        alert.JSON.stringify(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateWishlistForUser = async (wishlist_id) => {
    try {
      const body = {
        wishlist_item: updateWishlist.wishlistItem,
        wishlist_cost: parseFloat(updateWishlist.wishlistCost),
        wishlist_store: updateWishlist.wishlistStore,
        wishlist_status: updateWishlist.wishlistStatus,
      };

      const res = await fetchData(
        `/api/wishlists/${wishlist_id}`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log(res.data);
        props.getAllWishlistForAUser();
        props.setIsUpdateWishlistPressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setUpdateWishlist((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  useEffect(() => {
    getAllWishlistStatus();
  }, []);

  return (
    <div>
      <label>Item</label>
      <input
        id="wishlistItem"
        value={updateWishlist.wishlistItem}
        type="text"
        onChange={handleChange}
      ></input>
      <label>Cost</label>
      <input
        id="wishlistCost"
        value={updateWishlist.wishlistCost}
        type="text"
        onChange={handleChange}
      ></input>
      <label>Store</label>
      <input
        id="wishlistStore"
        value={updateWishlist.wishlistStore}
        type="text"
        onChange={handleChange}
      ></input>
      <label>Status</label>
      <select
        disabled={true}
        id="wishlistStatus"
        value={updateWishlist.wishlistStatus}
        onChange={handleChange}
      >
        {allWishlistStatus.map((wishlistStatus) => {
          return <option>{wishlistStatus.wishlist_status}</option>;
        })}
      </select>
      <button onClick={() => updateWishlistForUser(props.wishlistId)}>
        Submit
      </button>
      <button onClick={() => props.setIsUpdateWishlistPressed(false)}>
        Cancel
      </button>
    </div>
  );
};
const UpdateWishlistModal = (props) => {
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
          wishlistId={wishlist_id}
          wishlistItem={wishlist_item}
          wishlistCost={wishlist_cost}
          wishlistStore={wishlist_store}
          wishlistStatus={wishlist_status}
          setIsUpdateWishlistPressed={props.setIsUpdateWishlistPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateWishlistModal;
