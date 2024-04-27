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
    <div>
      <p>Register admin page</p>
      <label>name</label>
      <input ref={nameRef} type="text"></input>
      <label>email</label>
      <input ref={emailRef} type="text"></input>
      <label>password</label>
      <input ref={passwordRef} type="text"></input>
      <button onClick={() => registerAdmin()}>Submit</button>
      <button onClick={() => navigate("/admin")}>Cancel</button>
    </div>
  );
};

export default RegisterAdminPage;
