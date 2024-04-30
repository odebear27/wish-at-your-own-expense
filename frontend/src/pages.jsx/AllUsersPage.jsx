import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import User from "../components/User";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const AllUsersPage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const navigate = useNavigate();
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
    if (userCtx.accessToken) getAllUsers();
  }, [userCtx.accessToken]);

  return (
    <div>
      <button onClick={() => navigate("/view/admin")}>Go Back</button>
      <p className="text-lg">All Users listed below</p>
      <div className="grid grid-cols-4 gap-3">
        <div>Name</div>
        <div>Email</div>
        <div>Account active / deleted</div>
      </div>
      <div className="grid gap-3">
        {allUsers.map((user, idx) => {
          return <User key={idx} user={user} getAllUsers={getAllUsers}></User>;
        })}
      </div>
    </div>
  );
};

export default AllUsersPage;
