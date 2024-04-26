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
        console.log(res.data);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>Register user</div>
      <label>name</label>
      <input ref={nameRef} type="text"></input>
      <label>email</label>
      <input ref={emailRef} type="text"></input>
      <label>password</label>
      <input ref={passwordRef} type="text"></input>
      <label>budget amount</label>
      <input ref={budgetAmtRef} type="text"></input>
      <button onClick={registerUser}>register</button>
    </div>
  );
};

export default RegisterUserPage;
