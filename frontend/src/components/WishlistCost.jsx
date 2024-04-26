import React from "react";
import useWishlistCost from "../hooks/useWishlistCost";

const WishlistCost = () => {
  const wishlistCost = useWishlistCost();

  return (
    <div>
      {wishlistCost ? (
        <p>My wishlist cost: ${wishlistCost}</p>
      ) : (
        <p>My wishlist cost: $0</p>
      )}
    </div>
  );
};

export default WishlistCost;
