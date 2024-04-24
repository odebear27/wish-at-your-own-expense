import React, { useContext, useRef } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const UserLoginPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleUserLogin = async () => {
    const res = await fetchData("/auth/u/login", "POST", {
      user_email: emailRef.current.value,
      password: passwordRef.current.value,
    });

    if (res.ok) {
      console.log(res.data);
      userCtx.setAccessToken(res.data.access);
      userCtx.setRefreshToken(res.data.refresh);
      const decoded = jwtDecode(res.data.access);

      userCtx.setRole(decoded.role);
      userCtx.setUserId(decoded.id);
      userCtx.setUserEmail(decoded.email);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  return (
    <div>
      <button>Login as Admin</button>
      <label>username</label>
      <input ref={emailRef} type="text"></input>
      <label>password</label>
      <input ref={passwordRef} type="password"></input>
      <button onClick={() => handleUserLogin()}>Login</button>
    </div>
  );
};

export default UserLoginPage;
