import React, { useContext, useEffect, useState, useRef } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import Wishlist from "../components/Wishlist";
import useLocalStorage from "../hooks/useLocalStorage";
import AddWishlistModal from "../components/AddWishlistModal";

const WishlistPage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [wishlists, setWishlists] = useState([]);
  const [isAddWishlistPressed, setIsAddWishlistPressed] = useState(false);

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

  useEffect(() => {
    if (userCtx.accessToken) {
      getWishlistCost();
      getUserProfileAndBudget();
      getExpenseAmt();
      getAllWishlistForAUser();
    }
  }, [userCtx.accessToken]);

  return (
    <div className="mt-16 mx-5 py-6">
      <div className="flex justify-between py-3">
        {userCtx.wishlistCost > 0 ? (
          <div className="font-medium">
            My wishlist cost (unpurchased):{" "}
            {new Intl.NumberFormat("en-SG", {
              style: "currency",
              currency: "SGD",
            }).format(userCtx.wishlistCost)}
          </div>
        ) : (
          <div className="font-medium">My wishlist cost (unpurchased): $0</div>
        )}
        <button
          onClick={() => {
            setIsAddWishlistPressed(true);
          }}
        >
          <div className="flex space-x-0.5 items-center">
            <i class="bi bi-gift"></i>
            <span className="flex w-16 leading-tight font-medium">
              Add an item
            </span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-3 h-10 bg-colour-tableHeader items-center">
        <div className="font-medium">Item</div>
        <div className="font-medium">Cost</div>
        <div className="col-span-2 font-medium">Store</div>
        <div className="font-medium">Status</div>
        <div></div>
        <div></div>
      </div>
      <hr />
      {isAddWishlistPressed && (
        <AddWishlistModal
          getWishlistCost={getWishlistCost}
          getAllWishlistForAUser={getAllWishlistForAUser}
          setIsAddWishlistPressed={setIsAddWishlistPressed}
        ></AddWishlistModal>
      )}
      <div className="grid divide-y-[1.3px]">
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
