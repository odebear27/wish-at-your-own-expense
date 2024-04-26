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
        console.log(res.data);
        userCtx.setAccessToken(res.data.access);
        userCtx.setRefreshToken(res.data.refresh);
        const decoded = jwtDecode(res.data.access);

        console.log(decoded);
        userCtx.setRole(decoded.role);
        userCtx.setUserId(decoded.id);
        userCtx.setUserEmail(decoded.email);
        console.log(userCtx.userId);
        navigate("/profile");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button>Login as Admin</button>
      <label>email</label>
      <input ref={emailRef} type="text"></input>
      <label>password</label>
      <input ref={passwordRef} type="password"></input>
      <button
        onClick={() => {
          handleUserLogin();
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          navigate("/register/user");
        }}
      >
        No account? Register here
      </button>
    </div>
  );
};

export default UserLoginPage;
