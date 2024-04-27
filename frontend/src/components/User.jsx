import React from "react";

const User = (props) => {
  return (
    <div>
      <tr>
        <td>{props.user.user_name}</td>
        <td>{props.user.user_email}</td>
        <td>{props.user.user_is_active ? "active" : "deleted"}</td>
        <button>Delete</button>
      </tr>
    </div>
  );
};

export default User;
