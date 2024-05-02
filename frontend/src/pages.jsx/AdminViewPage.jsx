import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import UpdateAdminModal from "../components/UpdateAdminModal";
import useLocalStorage from "../hooks/useLocalStorage";
import userImage from "../assets/user_img.png";
import usersGroup from "../assets/users_group.png";
import deleteUser from "../assets/delete_user.png";

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
    <div className="mx-5">
      <div className="flex justify-end py-4">
        <button onClick={() => handleLogout()} title="logout">
          <i class="bi bi-door-open h4"></i>
        </button>
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="text-lg font-medium">
          Welcome {admin.admin_name} ({admin.admin_email})
        </p>
        <div className="text-lg py-4">What would you like to do today?</div>
      </div>

      {isUpdateAdminPressed && (
        <UpdateAdminModal
          admin={admin}
          setIsUpdateAdminPressed={setIsUpdateAdminPressed}
          getOneAdmin={getOneAdmin}
        ></UpdateAdminModal>
      )}

      <div className="flex gap-x-4">
        <div className="w-1/6 px-2.5 py-2.5 bg-colour-white">
          <button
            className="px-2.5 py-2.5 flex flex-wrap justify-center"
            onClick={() => setIsUpdateAdminPressed(true)}
          >
            <img className="h-32" src={userImage} />
            <span>Update your profile</span>
          </button>
        </div>
        <div className="w-1/6 px-2.5 py-2.5 bg-colour-white">
          <button
            className="px-2.5 py-2.5 flex flex-wrap justify-center"
            onClick={() => deleteAdminAccount()}
          >
            <img className="h-32" src={deleteUser} />
            <span>Delete your admin account (there is no going back)</span>
          </button>
        </div>
        <div className="w-1/6 px-2.5 py-2.5 bg-colour-white">
          <button onClick={() => navigate("/allusers/admin")}>
            <img src={usersGroup} />
            <span>View all users</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewPage;
