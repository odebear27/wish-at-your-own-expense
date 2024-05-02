import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import ErrorMessage from "../components/ErrorMessage";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [wishlist, setWishlist] = useState({
    item: "",
    cost: "",
    store: "",
  });

  const addWishlistForUser = async () => {
    try {
      const body = {
        wishlist_item: wishlist.item,
        wishlist_cost: parseFloat(wishlist.cost),
        wishlist_store: wishlist.store,
      };

      const res = await fetchData(
        `/api/wishlists`,
        "PUT",
        body,
        userCtx.accessToken
      );
      if (res.ok) {
        props.getWishlistCost();
        props.getAllWishlistForAUser();
        props.setIsAddWishlistPressed(false);
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
  const handleChange = (event) => {
    setWishlist((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  return (
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md">
        <div className="flex flex-col items-start space-y-3 mb-6">
          <div className="font-medium">Add Wishlist</div>
          <div className="w-auto flex space-x-4">
            <label>Item:</label>
            <input
              id="item"
              value={wishlist.item}
              onChange={handleChange}
              type="text"
            ></input>
          </div>

          <div className="w-auto flex space-x-4">
            <label>Cost:</label>
            <div className="space-x-1">
              <label>$</label>
              <input
                id="cost"
                value={wishlist.cost}
                onChange={handleChange}
                type="text"
              ></input>
            </div>
          </div>
          <div className="w-auto flex space-x-4">
            <label>Store:</label>
            <textarea
              className="w-96 h-20"
              id="store"
              value={wishlist.store}
              onChange={handleChange}
              type="text"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="button"
            onClick={() => {
              addWishlistForUser();
              setMessage("");
            }}
          >
            Submit
          </button>
          <button
            className="button"
            onClick={() => props.setIsAddWishlistPressed(false)}
          >
            Cancel
          </button>
        </div>
        <ErrorMessage message={message}></ErrorMessage>
      </div>
    </div>
  );
};
const AddWishlistModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          getWishlistCost={props.getWishlistCost}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          setIsAddWishlistPressed={props.setIsAddWishlistPressed}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddWishlistModal;
