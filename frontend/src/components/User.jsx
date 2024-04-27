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
    <div>
      <tr>
        <td>{props.user.user_name}</td>
        <td>{props.user.user_email}</td>
        <td>{props.user.user_is_active ? "active" : "deleted"}</td>
        {props.user.user_is_active === true && (
          <button onClick={() => deleteUser(props.user.user_id)}>Delete</button>
        )}
      </tr>
    </div>
  );
};

export default User;
