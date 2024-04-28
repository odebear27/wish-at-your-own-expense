import React, { useContext, useRef, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleAdminLogin = async () => {
    try {
      const res = await fetchData("/auth/a/login", "POST", {
        admin_email: emailRef.current.value,
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
        navigate("/view/admin");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Back to user login
      </button>
      <label>email</label>
      <input ref={emailRef} type="text"></input>
      <label>password</label>
      <input ref={passwordRef} type="password"></input>
      <button
        onClick={() => {
          handleAdminLogin();
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          navigate("/register/admin");
        }}
      >
        Register as Admin
      </button>
    </div>
  );
};

export default AdminLoginPage;
