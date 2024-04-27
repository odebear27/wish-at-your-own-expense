import React, { useContext } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const AdminViewPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const navigate = useNavigate();

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
  return (
    <div>
      <p>Admin view page</p>
      <button onClick={() => deleteAdminAccount()}>
        Delete your admin account (there is no going back)
      </button>
      <button>Delete user account</button>
    </div>
  );
};

export default AdminViewPage;
