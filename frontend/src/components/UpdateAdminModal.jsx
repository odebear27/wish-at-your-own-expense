import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [updateAdmin, setUpdateAdmin] = useState({
    adminName: props.adminName,
  });

  const updateAdminAccount = async () => {
    try {
      const body = { admin_name: updateAdmin.adminName };

      const res = await fetchData(
        `/auth/a/update`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log(res.data);
        props.getOneAdmin();
        props.setIsUpdateAdminPressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setUpdateAdmin((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  return (
    <div>
      <p>Update Admin</p>
      <label>name</label>
      <input
        id="adminName"
        value={updateAdmin.adminName}
        type="text"
        onChange={handleChange}
      ></input>
      <button onClick={() => updateAdminAccount()}>Submit</button>
      <button onClick={() => props.setIsUpdateAdminPressed(false)}>
        Cancel
      </button>
    </div>
  );
};

const UpdateAdminModal = (props) => {
  const { admin_name } = props.admin;
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          adminName={admin_name}
          setIsUpdateAdminPressed={props.setIsUpdateAdminPressed}
          getOneAdmin={props.getOneAdmin}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateAdminModal;
