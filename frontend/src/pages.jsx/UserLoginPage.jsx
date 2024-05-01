import React, { useContext, useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
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
        navigate("/profile");
      } else {
        setMessage("login error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-flyingSanta bg-cover bg-center object-fill">
      <div className="grid h-screen place-items-center relative">
        <div className="absolute top-5 right-5">
          <button
            className="text-colour-white font-medium"
            onClick={() => navigate("/admin")}
          >
            Login as Admin
          </button>
        </div>
        <div className="text-colour-white font-medium text-lg">
          Wish at you own Expense
        </div>
        <div className="flex flex-col items-center space-y-4 fixed bottom-20">
          <div className="w-auto flex space-x-10">
            <label className="text-colour-white font-medium">email</label>
            <input ref={emailRef} type="text"></input>
          </div>
          <div className="w-auto flex space-x-4">
            <label className="text-colour-white font-medium">password</label>
            <input ref={passwordRef} type="password"></input>
          </div>

          {message.length > 0 ? (
            <div className="text-colour-red font-medium">{message}</div>
          ) : (
            <div className="h-6"></div>
          )}

          <div className="w-auto">
            <button
              className="text-colour-white font-medium"
              onClick={() => {
                handleUserLogin();
                setMessage("");
              }}
            >
              Login
            </button>
          </div>
          <div className="w-auto">
            <button
              className="text-colour-white font-medium"
              onClick={() => {
                navigate("/register/user");
              }}
            >
              No account? Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
