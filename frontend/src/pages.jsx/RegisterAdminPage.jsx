import React, { useRef } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const RegisterAdminPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const registerAdmin = async () => {
    try {
      const res = await fetchData(`/auth/a/register`, "PUT", {
        admin_name: nameRef.current.value,
        admin_email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      if (res.ok) {
        console.log(res.data);
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-3 my-8 mx-5">
      <div className="font-medium">Register admin</div>
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
      <div className="flex space-x-4 py-4">
        <button className="button" onClick={() => registerAdmin()}>
          Submit
        </button>
        <button className="button" onClick={() => navigate("/admin")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
