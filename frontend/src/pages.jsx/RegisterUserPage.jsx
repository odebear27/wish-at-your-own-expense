import React, { useRef } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const RegisterUserPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const budgetAmtRef = useRef();

  const registerUser = async () => {
    try {
      const res = await fetchData(`/auth/u/register`, "PUT", {
        user_name: nameRef.current.value,
        user_email: emailRef.current.value,
        password: passwordRef.current.value,
        budget_amt: parseFloat(budgetAmtRef.current.value),
      });
      if (res.ok) {
        navigate("/");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-3 my-8 mx-5">
      <div className="font-medium">Register user</div>
      <div className="w-auto flex space-x-4">
        <label>name:</label>
        <input ref={nameRef} type="text"></input>
      </div>
      <div className="w-auto flex space-x-4">
        <label>email:</label>
        <input ref={emailRef} type="text"></input>
      </div>
      <div className="w-auto flex space-x-4">
        <label>password:</label>
        <input ref={passwordRef} type="password"></input>
      </div>
      <div className="max-w-xl flex flex-wrap space-x-4">
        <label>budget amount per month:</label>
        <div className="space-x-1">
          <label>$</label>
          <input ref={budgetAmtRef} type="text"></input>
        </div>
      </div>
      <div className="flex space-x-4 py-4">
        <button className="button" onClick={registerUser}>
          Register
        </button>
        <button className="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterUserPage;
