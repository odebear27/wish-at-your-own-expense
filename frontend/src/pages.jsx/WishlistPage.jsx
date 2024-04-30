import React, { useContext, useEffect, useState, useRef } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import Wishlist from "../components/Wishlist";
import useLocalStorage from "../hooks/useLocalStorage";

const WishlistPage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [wishlists, setWishlists] = useState([]);
  const [isAddWishlistPressed, setIsAddWishlistPressed] = useState(false);

  const itemRef = useRef();
  const costRef = useRef();
  const storeRef = useRef();

  const getUserProfileAndBudget = async () => {
    try {
      const res = await fetchData(
        `/auth/u/profilebudget`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data);

        // using userCtx.setBudget so that can access in Wishlist
        userCtx.setBudget(res.data[0].budget_amt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("sum" + res.data);
        userCtx.setExpense(res.data[0].sum);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {}
  };

  const getWishlistCost = async () => {
    try {
      const res = await fetchData(
        `/api/wishlistscost`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        userCtx.setWishlistCost(res.data[0].sum);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        getWishlistCost();
        getAllWishlistForAUser();
        setIsAddWishlistPressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) {
      getWishlistCost();
      getUserProfileAndBudget();
      getExpenseAmt();
      getAllWishlistForAUser();
    }
  }, [userCtx.accessToken]);

  return (
    <div className="mt-16">
      <p>Wishlist Page</p>
      <div className="grid grid-cols-6">
        {userCtx.wishlistCost > 0 ? (
          <div>
            My wishlist cost (unpurchased):{" "}
            {new Intl.NumberFormat("en-SG", {
              style: "currency",
              currency: "SGD",
            }).format(userCtx.wishlistCost)}
          </div>
        ) : (
          <div>My wishlist cost (unpurchased): $0</div>
        )}
        {/* <WishlistCost></WishlistCost> */}
        {/* {JSON.stringify(wishlists)} */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <button
          onClick={() => {
            setIsAddWishlistPressed(true);
          }}
        >
          Add an item
        </button>
      </div>

      <div className="grid grid-cols-8 gap-3">
        <div>Item</div>
        <div>Cost</div>
        <div className="col-span-2">Store</div>
        <div>Status</div>
        <div></div>
        <div></div>
      </div>
      {isAddWishlistPressed && (
        <div className="grid grid-cols-8 gap-3">
          <textarea className="h-12" ref={itemRef} type="text"></textarea>
          <textarea ref={costRef} type="text"></textarea>
          <textarea
            className="col-span-2"
            ref={storeRef}
            type="text"
          ></textarea>
          <select className="dropdown w-44" disabled={true}>
            <option>NOT YET PURCHASED</option>
          </select>
          <button onClick={() => addWishlistForUser()}>Submit</button>
          <button onClick={() => setIsAddWishlistPressed(false)}>Cancel</button>
        </div>
      )}
      <div className="grid gap-y-3">
        {wishlists.map((wishlist, idx) => {
          return (
            <Wishlist
              key={idx}
              wishlist={wishlist}
              getAllWishlistForAUser={getAllWishlistForAUser}
              getWishlistCost={getWishlistCost}
            ></Wishlist>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
