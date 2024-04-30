import React, { useContext } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";

const User = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const deleteUser = async (userId) => {
    try {
      console.log(userId);
      const res = await fetchData(
        "/auth/u/delete/" + userId,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getAllUsers();
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-1 pb-3">
      <div className="grid grid-cols-4 gap-3">
        <div>{props.user.user_name}</div>
        <div>{props.user.user_email}</div>
        <div>{props.user.user_is_active ? "active" : "deleted"}</div>
        {props.user.user_is_active === true && (
          <button onClick={() => deleteUser(props.user.user_id)} title="delete">
            <i class="bi bi-trash3-fill"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
