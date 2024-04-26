import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";

const useWishlistCost = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [wishlistCost, setWishlistCost] = useState(0);

  const getWishlistCost = async () => {
    try {
      const res = await fetchData(
        `/api/wishlistscost`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setWishlistCost(res.data[0].sum);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) {
      getWishlistCost();
    }
  }, [userCtx.accessToken]);

  return wishlistCost;
};

export default useWishlistCost;
