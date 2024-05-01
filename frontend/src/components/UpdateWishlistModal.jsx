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
        props.getWishlistCost();
        props.checkIfCanBuy();
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
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-6">
          <div className="font-medium">Update Wishlist</div>
          <div className="w-auto flex space-x-4">
            <label>Item:</label>
            <input
              id="wishlistItem"
              value={updateWishlist.wishlistItem}
              type="text"
              onChange={handleChange}
            ></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Cost:</label>
            <div className="space-x-1">
              <label>$</label>
              <input
                id="wishlistCost"
                value={updateWishlist.wishlistCost}
                type="text"
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Store:</label>
            <textarea
              className="w-96 h-20"
              id="wishlistStore"
              value={updateWishlist.wishlistStore}
              type="text"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Status:</label>
            <select
              className="dropdown"
              // disabled={true}
              id="wishlistStatus"
              value={updateWishlist.wishlistStatus}
              onChange={handleChange}
            >
              {allWishlistStatus.map((wishlistStatus) => {
                return <option>{wishlistStatus.wishlist_status}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="button"
            onClick={() => updateWishlistForUser(props.wishlistId)}
          >
            Submit
          </button>
          <button
            className="button"
            onClick={() => props.setIsUpdateWishlistPressed(false)}
          >
            Cancel
          </button>
        </div>
      </div>
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
          getWishlistCost={props.getWishlistCost}
          checkIfCanBuy={props.checkIfCanBuy}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateWishlistModal;
