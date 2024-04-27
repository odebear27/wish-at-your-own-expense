import React from "react";

const Wishlist = (props) => {
  return (
    <div>
      <tr>
        <td>{props.wishlist.wishlist_item}</td>
        <td>{props.wishlist.wishlist_cost}</td>
        <td>{props.wishlist.wishlist_store}</td>
        <button>update</button>
        <button>delete</button>
      </tr>
    </div>
  );
};

export default Wishlist;
