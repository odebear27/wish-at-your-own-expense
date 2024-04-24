import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const UserProfilePage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [userProfile, setUserProfile] = useState({});

  const getUserProfile = async () => {
    try {
      const res = await fetchData(
        `/auth/u/profile/${userCtx.userId}`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data[0]);
        setUserProfile(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [userCtx.userId]);

  return (
    <div>
      <h1>user profile page</h1>
      <p>{userProfile.user_email}</p>
      <p>{userProfile.user_name}</p>
    </div>
  );
};

export default UserProfilePage;
