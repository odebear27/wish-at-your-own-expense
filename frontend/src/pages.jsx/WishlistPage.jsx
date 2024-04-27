import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import WishlistCost from "../components/WishlistCost";
import UserContext from "../context/user";
import Wishlist from "../components/Wishlist";

const WishlistPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [wishlists, setWishlists] = useState([]);

  const getAllWishlistForAUser = async () => {
    try {
      const res = await fetchData(
        `/api/wishlists`,
        undefined,
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log(res.data);
        setWishlists(res.data);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWishlistForAUser();
  }, []);

  return (
    <div>
      <p>Wishlist Page</p>
      <WishlistCost></WishlistCost>
      {/* {JSON.stringify(wishlists)} */}
      <tr>
        <td>Item</td>
        <td>Cost</td>
        <td>Store</td>
        <td>Status</td>
      </tr>
      {wishlists.map((wishlist, idx) => {
        return <Wishlist key={idx} wishlist={wishlist}></Wishlist>;
      })}
    </div>
  );
};

export default WishlistPage;
