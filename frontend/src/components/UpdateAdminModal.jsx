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
    <div className="z-10 w-screen h-screen bg-gray-800/75 fixed top-0 left-0 flex">
      <div className="updateModal whitesmoke px-5 z-100 fixed top-1/4 w-auto overflow-hidden py-5 rounded-md flex flex-col justify-between">
        <div className="flex flex-col items-start space-y-3 mb-6">
          <p>Update Admin</p>
          <div className="w-auto flex space-x-4">
            <label>name</label>
            <input
              id="adminName"
              value={updateAdmin.adminName}
              type="text"
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="button" onClick={() => updateAdminAccount()}>
            Submit
          </button>
          <button
            className="button"
            onClick={() => props.setIsUpdateAdminPressed(false)}
          >
            Cancel
          </button>
        </div>
      </div>
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
