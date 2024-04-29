import React, { useContext, useEffect } from "react";
import UserContext from "../context/user";

const useAuth = () => {
  const userCtx = useContext(UserContext);

  useEffect(() => {
    console.log("useEffect running");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    console.log("finished getting from local storage");
    console.log(accessToken);
    console.log(refreshToken);
    console.log(role);
    console.log(userId);
    console.log(userEmail);

    if (accessToken) userCtx.setAccessToken(accessToken);
    if (refreshToken) userCtx.setRefreshToken(refreshToken);
    if (role) userCtx.setRole(role);
    if (userId) userCtx.setUserId(userId);
    if (userEmail) userCtx.setUserEmail(userEmail);

    console.log("finished storing in userCtx");
  }, []);

  //   const login = (accessToken, refreshToken, role, userId, userEmail) => {
  //     // store in local storage
  //     localStorage.setItem("accessToken", accessToken);
  //     localStorage.setItem("refreshToken", refreshToken);
  //     localStorage.setItem("role", role);
  //     localStorage.setItem("userId", userId);
  //     localStorage.setItem("userEmail", userEmail);

  //     // store in userCtx
  //     userCtx.setAccessToken(accessToken);
  //     userCtx.setRefreshToken(refreshToken);

  //     userCtx.setRole(role);
  //     userCtx.setUserId(userId);
  //     userCtx.setUserEmail(userEmail);
  //     userCtx.setIsLoggedIn(true);
  //   };

  //   const logout = () => {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //     localStorage.removeItem("role");
  //     localStorage.removeItem("userId");
  //     localStorage.removeItem("userEmail");

  //     setIsLoggedIn(false);
  //     setAccessToken(null);
  //     setRefreshToken(null);
  //     setRole(null);
  //     setUserId(null);
  //     setUserEmail(null);
  //   };

  //   return {
  //     isLoggedIn,
  //     accessToken,
  //     refreshToken,
  //     role,
  //     userId,
  //     userEmail,
  //     login,
  //     logout,
  //   };
};

export default useAuth;
