import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import UpdateAdminModal from "../components/UpdateAdminModal";
import useLocalStorage from "../hooks/useLocalStorage";

const AdminViewPage = () => {
  useLocalStorage();
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    userCtx.setIsLoggedIn(false);
    userCtx.setAccessToken(null);
    userCtx.setRefreshToken(null);
    userCtx.setRole(null);
    userCtx.setUserId(null);
    userCtx.setUserEmail(null);

    navigate("/admin");
  };

  useEffect(() => {
    if (userCtx.accessToken) getOneAdmin();
  }, [userCtx.accessToken]);

  return (
    <div>
      <div className="flex justify-end">
        <button className="" onClick={() => handleLogout()}>
          Log Out
        </button>
      </div>
      <div className="flex flex-col gap-y-4">
        <p>Admin view page</p>
        <p className="text-lg">
          Welcome {admin.admin_name} ({admin.admin_email})
        </p>
        <div className="text-lg">What would you like to do today?</div>
      </div>

      {isUpdateAdminPressed && (
        <UpdateAdminModal
          admin={admin}
          setIsUpdateAdminPressed={setIsUpdateAdminPressed}
          getOneAdmin={getOneAdmin}
        ></UpdateAdminModal>
      )}

      <div className="flex flex-col gap-y-4">
        <div>
          <button onClick={() => setIsUpdateAdminPressed(true)}>
            - Update your profile
          </button>
        </div>
        <div>
          <button onClick={() => deleteAdminAccount()}>
            - Delete your admin account (there is no going back)
          </button>
        </div>
        <div>
          <button onClick={() => navigate("/allusers/admin")}>
            - View all users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewPage;
