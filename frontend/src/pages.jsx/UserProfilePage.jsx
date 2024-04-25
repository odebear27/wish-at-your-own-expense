import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const UserProfilePage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [userProfileAndBudget, setUserProfileAndBudget] = useState({});
  const [wishlistCost, setWishlistCost] = useState();
  const [expensesAmt, setExpenseAmt] = useState();
  const [isUpdateUserPressed, setIsUpdateUserPressed] = useState(false);
  const [updateUserProfile, setUpdateUserProfile] = useState({
    user_name: userProfileAndBudget.user_name,
    budget_amt: userProfileAndBudget.budget_amt,
  });

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
        setUserProfileAndBudget(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
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
        setWishlistCost(res.data[0].sum);
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
        console.log(res.data);
        setExpenseAmt(res.data[0].sum);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUserProfileAndBudget();
    getWishlistCost();
    getExpenseAmt();
  }, []);

  // useEffect(() => {
  //   getUserProfileAndBudget();
  //   getWishlistCost();
  //   getExpenseAmt();
  // }, [userCtx.userId]);

  useEffect(() => {
    if (userProfileAndBudget) {
      setUpdateUserProfile({
        user_name: userProfileAndBudget.user_name || "",
        budget_amt: userProfileAndBudget.budget_amt || "",
      });
    }
  }, [userProfileAndBudget]);

  const handleChange = (event) => {
    setUpdateUserProfile((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  const updateUser = async () => {
    try {
      const body = {
        user_name: updateUserProfile.user_name,
      };
      const resForUpdateUser = await fetchData(
        `/auth/u/update`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      const resForUpdateUserBudget = await fetchData(
        `/auth/u/updatebudget`,
        "PATCH",
        { budget_amt: updateUserProfile.budget_amt },
        userCtx.accessToken
      );

      if (resForUpdateUser.ok && resForUpdateUserBudget.ok) {
        getUserProfileAndBudget();
        setIsUpdateUserPressed(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>user profile page</h1>
      {!isUpdateUserPressed ? (
        // ========================== user profile view ============================== //
        <div>
          <p>My name: {userProfileAndBudget.user_name}</p>
          <p>My email: {userProfileAndBudget.user_email}</p>
          <p>My budget for the month: ${userProfileAndBudget.budget_amt}</p>
          {expensesAmt ? (
            <p>My Expenses: ${expensesAmt}</p>
          ) : (
            <p>My Expenses: $0</p>
          )}
          {wishlistCost ? (
            <p>My wishlist cost: ${wishlistCost}</p>
          ) : (
            <p>My wishlist cost: $0</p>
          )}

          <button onClick={() => setIsUpdateUserPressed(true)}>
            update profile
          </button>
        </div>
      ) : (
        // ========================== update user profile view ============================== //
        <div>
          <p>My name: </p>
          <input
            id="user_name"
            type="text"
            value={updateUserProfile.user_name}
            onChange={handleChange}
          ></input>
          <p>My email: {userProfileAndBudget.user_email}</p>
          <p>My budget for the month: </p>
          <input
            id="budget_amt"
            type="text"
            value={updateUserProfile.budget_amt}
            onChange={handleChange}
          ></input>
          {expensesAmt ? (
            <p>My Expenses: ${expensesAmt}</p>
          ) : (
            <p>My Expenses: $0</p>
          )}
          {wishlistCost ? (
            <p>My wishlist cost: ${wishlistCost}</p>
          ) : (
            <p>My wishlist cost: $0</p>
          )}
          <button onClick={updateUser}>submit</button>
          <button onClick={() => setIsUpdateUserPressed(false)}>cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
