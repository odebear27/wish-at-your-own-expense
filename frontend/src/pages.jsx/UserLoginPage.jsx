import React, { useContext, useRef, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleUserLogin = async () => {
    try {
      const res = await fetchData("/auth/u/login", "POST", {
        user_email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        userCtx.setAccessToken(res.data.access);
        userCtx.setRefreshToken(res.data.refresh);
        const decoded = jwtDecode(res.data.access);

        userCtx.setRole(decoded.role);
        userCtx.setUserId(decoded.id);
        userCtx.setUserEmail(decoded.email);
        userCtx.setIsLoggedIn(true);
        navigate("/profile");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const callRefreshToken = async () => {
  //   try {
  //     const res = await fetchData("/auth/u/refresh", "POST", {
  //       refresh: userCtx.refreshToken,
  //     });
  //     if (res.ok) {
  //       console.log("refreshing");
  //       console.log(res.data);
  //       userCtx.setAccessToken(res.data.access);
  //     } else {
  //       alert(JSON.stringify(res.data));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   let intervalId;
  //   // Set up interval to refresh token every 15 minutes
  //   if (userCtx.refreshToken) {
  //     intervalId = setInterval(callRefreshToken, 1000);
  //   }
  //   // 15 minutes

  //   // Clean up interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [userCtx.isLoggedIn]);

  return (
    <div className="grid h-screen place-items-center relative">
      <div className="absolute top-5 right-5">
        <button onClick={() => navigate("/admin")}>Login as Admin</button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-auto flex space-x-10">
          <label>email</label>
          <input ref={emailRef} type="text"></input>
        </div>
        <div className="w-auto flex space-x-4">
          <label>password</label>
          <input ref={passwordRef} type="password"></input>
        </div>
        <div className="w-auto">
          <button
            onClick={() => {
              handleUserLogin();
            }}
          >
            Login
          </button>
        </div>
        <div className="w-auto">
          <button
            onClick={() => {
              navigate("/register/user");
            }}
          >
            No account? Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
