import React, { useContext, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import UpdateWishlistModal from "./UpdateWishlistModal";

const Wishlist = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [isUpdateWishlistPressed, setIsUpdateWishlistPressed] = useState(false);

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

  return (
    <div>
      {isUpdateWishlistPressed && (
        <UpdateWishlistModal
          wishlist={props.wishlist}
          setIsUpdateWishlistPressed={setIsUpdateWishlistPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
        ></UpdateWishlistModal>
      )}
      <tr>
        <td>{props.wishlist.wishlist_item}</td>
        <td>{props.wishlist.wishlist_cost}</td>
        <td>{props.wishlist.wishlist_store}</td>
        <td>{props.wishlist.wishlist_status}</td>
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
