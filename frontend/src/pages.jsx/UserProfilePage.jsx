import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import ExpenseAmt from "../components/ExpenseAmt";
import WishlistCost from "../components/WishlistCost";
import useLocalStorage from "../hooks/useLocalStorage";

const UserProfilePage = () => {
  useLocalStorage();
  const fetchData = useFetch();
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const [userProfileAndBudget, setUserProfileAndBudget] = useState({});
  const [isUpdateUserPressed, setIsUpdateUserPressed] = useState(false);
  const [updateUserProfile, setUpdateUserProfile] = useState({
    user_name: userProfileAndBudget.user_name,
    budget_amt: userProfileAndBudget.budget_amt,
  });

  const getUserProfileAndBudget = async () => {
    try {
      const res = await fetchData(
        `/auth/u/profilebudget`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data);
        setUserProfileAndBudget(res.data[0]);

        // using userCtx.setBudget so that can access in Wishlist
        userCtx.setBudget(res.data[0].budget_amt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) getUserProfileAndBudget();
  }, [userCtx.accessToken]);

  // useEffect(() => {
  //   getUserProfileAndBudget();
  //   getWishlistCost();
  //   getExpenseAmt();
  // }, [userCtx.userId]);

  useEffect(() => {
    if (userProfileAndBudget) {
      setUpdateUserProfile({
        user_name: userProfileAndBudget.user_name || "",
        budget_amt: userProfileAndBudget.budget_amt || "",
      });
    }
  }, [userProfileAndBudget]);

  const handleChange = (event) => {
    setUpdateUserProfile((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  const updateUser = async () => {
    try {
      const body = {
        user_name: updateUserProfile.user_name,
      };
      const resForUpdateUser = await fetchData(
        `/auth/u/update`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      const resForUpdateUserBudget = await fetchData(
        `/auth/u/updatebudget`,
        "PATCH",
        { budget_amt: updateUserProfile.budget_amt },
        userCtx.accessToken
      );

      if (resForUpdateUser.ok && resForUpdateUserBudget.ok) {
        getUserProfileAndBudget();
        setIsUpdateUserPressed(false);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await fetchData(
        `/auth/u/delete/${userCtx.userId}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        navigate("/");
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-16 space-y-4">
      <div>user profile page</div>
      {!isUpdateUserPressed ? (
        // ========================== user profile view ============================== //
        <div className="flex justify-center">
          <div className="flex flex-col items-start space-y-4">
            <p>My name: {userProfileAndBudget.user_name}</p>
            <p>My email: {userProfileAndBudget.user_email}</p>
            <p>My budget for the month: ${userProfileAndBudget.budget_amt}</p>
            {/* <p>My budget for the month: ${userCtx.budget}</p> */}
            <ExpenseAmt></ExpenseAmt>
            <WishlistCost></WishlistCost>
            <button
              className="button"
              onClick={() => setIsUpdateUserPressed(true)}
            >
              update profile
            </button>
            <button className="button" onClick={deleteUser}>
              delete profile (there is no going back)
            </button>
          </div>
        </div>
      ) : (
        // ========================== update user profile view ============================== //
        <div className="flex justify-center">
          <div className="flex flex-col items-start space-y-4">
            <div className="w-auto flex space-x-4">
              <p>My name: </p>
              <input
                id="user_name"
                type="text"
                value={updateUserProfile.user_name}
                onChange={handleChange}
              ></input>
            </div>

            <p>My email: {userProfileAndBudget.user_email}</p>

            <div className="w-auto flex space-x-4">
              <p>My budget for the month: </p>
              <input
                id="budget_amt"
                type="text"
                value={updateUserProfile.budget_amt}
                // value={userCtx.budget}
                onChange={handleChange}
              ></input>
            </div>

            <ExpenseAmt></ExpenseAmt>
            <WishlistCost></WishlistCost>
            <button className="button" onClick={updateUser}>
              submit
            </button>
            <button
              className="button"
              onClick={() => setIsUpdateUserPressed(false)}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
