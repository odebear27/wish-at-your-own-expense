import React, { useContext, useEffect } from "react";
import UserContext from "../context/user";

const useLocalStorage = () => {
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (accessToken) userCtx.setAccessToken(accessToken);
    if (refreshToken) userCtx.setRefreshToken(refreshToken);
    if (role) userCtx.setRole(role);
    if (userId) userCtx.setUserId(userId);
    if (userEmail) userCtx.setUserEmail(userEmail);
  }, []);
};

export default useLocalStorage;
