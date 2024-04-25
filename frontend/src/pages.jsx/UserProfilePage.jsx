import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const UserProfilePage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [userProfileAndBudget, setUserProfileAndBudget] = useState({});

  const getUserProfileAndBudget = async () => {
    try {
      const res = await fetchData(
        `/auth/u/profilebudget`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data[0]);
        setUserProfileAndBudget(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfileAndBudget();
  }, [userCtx.userId]);

  return (
    <div>
      <h1>user profile page</h1>
      <p>My name: {userProfileAndBudget.user_name}</p>
      <p>My email: {userProfileAndBudget.user_email}</p>
      <p>My budget for the month: {userProfileAndBudget.budget_amt}</p>
    </div>
  );
};

export default UserProfilePage;
