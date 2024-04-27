import React, { useContext, useEffect, useState, useRef } from "react";
import useFetch from "../hooks/useFetch";
import WishlistCost from "../components/WishlistCost";
import UserContext from "../context/user";
import Wishlist from "../components/Wishlist";

const WishlistPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [wishlists, setWishlists] = useState([]);
  const [isAddWishlistPressed, setIsAddWishlistPressed] = useState(false);
  const [allWishlistStatus, setAllWishlistStatus] = useState([]);
  const itemRef = useRef();
  const costRef = useRef();
  const storeRef = useRef();
  const statusRef = useRef();

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

  const addWishlistForUser = async () => {
    try {
      const body = {
        wishlist_item: itemRef.current.value,
        wishlist_cost: parseFloat(costRef.current.value),
        wishlist_store: storeRef.current.value,
      };

      const res = await fetchData(
        `/api/wishlists`,
        "PUT",
        body,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data);
        getAllWishlistForAUser();
        setIsAddWishlistPressed(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllWishlistForAUser();
    getAllWishlistStatus();
  }, []);

  return (
    <div>
      <p>Wishlist Page</p>
      <WishlistCost></WishlistCost>
      {/* {JSON.stringify(wishlists)} */}
      <button
        onClick={() => {
          setIsAddWishlistPressed(true);
        }}
      >
        Add an item
      </button>
      <tr>
        <td>Item</td>
        <td>Cost</td>
        <td>Store</td>
        <td>Status</td>
      </tr>
      {isAddWishlistPressed && (
        <div>
          <input ref={itemRef} type="text"></input>
          <input ref={costRef} type="text"></input>
          <input ref={storeRef} type="text"></input>
          {/* <select ref={statusRef}>
            {allWishlistStatus.map((wishlistStatus) => {
              return <option>{wishlistStatus.wishlist_status}</option>;
            })}
          </select> */}
          <button onClick={() => addWishlistForUser()}>Submit</button>
          <button onClick={() => setIsAddWishlistPressed(false)}>Cancel</button>
        </div>
      )}
      {wishlists.map((wishlist, idx) => {
        return <Wishlist key={idx} wishlist={wishlist}></Wishlist>;
      })}
    </div>
  );
};

export default WishlistPage;
