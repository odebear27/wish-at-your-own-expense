import React, { useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const RegisterAdminPage = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
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
        navigate("/admin");
      } else {
        if (JSON.stringify(res.data) === '"duplicate email"') {
          setMessage("user email already registered");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-8 mx-5">
      <div className="flex flex-col items-start space-y-3">
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
        <div className="flex space-x-4 pb-2 pt-4">
          <button
            className="button"
            onClick={() => {
              registerAdmin();
              setMessage("");
            }}
          >
            Submit
          </button>
          <button className="button" onClick={() => navigate("/admin")}>
            Cancel
          </button>
        </div>
        <div className="text-colour-red font-medium">{message}</div>
      </div>
    </div>
  );
};

export default RegisterAdminPage;
