import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import UpdateAdminModal from "../components/UpdateAdminModal";

const AdminViewPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({});
  const [isUpdateAdminPressed, setIsUpdateAdminPressed] = useState(false);

  const getOneAdmin = async () => {
    try {
      const res = await fetchData(
        `/auth/a/profile`,
        "POST",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        setAdmin(res.data);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAdminAccount = async () => {
    try {
      const res = await fetchData(
        `/auth/a/delete`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOneAdmin();
  }, []);

  return (
    <div>
      <p>Admin view page</p>
      <p>
        Welcome {admin.admin_name} ({admin.admin_email})
      </p>
      {isUpdateAdminPressed && (
        <UpdateAdminModal
          admin={admin}
          setIsUpdateAdminPressed={setIsUpdateAdminPressed}
          getOneAdmin={getOneAdmin}
        ></UpdateAdminModal>
      )}
      <button onClick={() => setIsUpdateAdminPressed(true)}>
        Update your profile
      </button>
      <button onClick={() => deleteAdminAccount()}>
        Delete your admin account (there is no going back)
      </button>
      <button onClick={() => navigate("/allusers/admin")}>
        View all users
      </button>
    </div>
  );
};

export default AdminViewPage;
