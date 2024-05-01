import React, { useContext, useRef } from "react";
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
        const decoded = jwtDecode(res.data.access);

        // store in local storage
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("userId", decoded.id);
        localStorage.setItem("userEmail", decoded.email);

        // store in userCtx
        userCtx.setAccessToken(res.data.access);
        userCtx.setRefreshToken(res.data.refresh);

        userCtx.setRole(decoded.role);
        userCtx.setUserId(decoded.id);
        userCtx.setUserEmail(decoded.email);
        userCtx.setIsLoggedIn(true);

        navigate("/view/admin");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid h-screen place-items-center relative bg-colour-darkBlue">
      <div className="absolute top-5 right-5">
        <button
          className="text-colour-white font-medium"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to user login
        </button>
      </div>
      <div className="text-colour-white font-medium text-lg">
        Wish at you own Expense Admin Portal
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-auto flex space-x-10">
          <label className="text-colour-white font-medium">email</label>
          <input ref={emailRef} type="text"></input>
        </div>
        <div className="w-auto flex space-x-4">
          <label className="text-colour-white font-medium">password</label>
          <input ref={passwordRef} type="password"></input>
        </div>
        <div className="w-auto">
          <button
            className="text-colour-white font-medium"
            onClick={() => {
              handleAdminLogin();
            }}
          >
            Login
          </button>
        </div>

        <div className="w-auto">
          <button
            className="text-colour-white font-medium"
            onClick={() => {
              navigate("/register/admin");
            }}
          >
            Register as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
