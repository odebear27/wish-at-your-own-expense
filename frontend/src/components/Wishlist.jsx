import React, { useContext } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";

const Wishlist = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

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
      <tr>
        <td>{props.wishlist.wishlist_item}</td>
        <td>{props.wishlist.wishlist_cost}</td>
        <td>{props.wishlist.wishlist_store}</td>
        <td>{props.wishlist.wishlist_status}</td>
        <button>update</button>
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
