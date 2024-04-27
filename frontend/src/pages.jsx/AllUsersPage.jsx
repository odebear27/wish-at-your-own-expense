import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import User from "../components/User";

const AllUsersPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await fetchData(
        `/auth/u`,
        undefined,
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log(res.data);
        setAllUsers(res.data);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      <p>All Users listed below</p>
      <tr>
        <td>Name</td>
        <td>Email</td>
        <td>Account active / deleted</td>
      </tr>
      {allUsers.map((user, idx) => {
        return <User key={idx} user={user}></User>;
      })}
    </div>
  );
};

export default AllUsersPage;
