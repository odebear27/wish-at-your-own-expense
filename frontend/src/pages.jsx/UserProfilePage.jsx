import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import piggyBank from "../assets/piggy_bank.png";

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

  const getExpenseAmt = async () => {
    try {
      const res = await fetchData(
        `/api/expensesamt`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("sum" + res.data);
        // setExpenseAmt(res.data[0].sum);
        userCtx.setExpense(res.data[0].sum);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {}
  };

  const getWishlistCost = async () => {
    try {
      const res = await fetchData(
        `/api/wishlistscost`,
        "POST",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        userCtx.setWishlistCost(res.data[0].sum);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (userCtx.accessToken) {
      getUserProfileAndBudget();
      getExpenseAmt();
      getWishlistCost();
    }
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

  return (
    <div className="mt-16 space-y-4 py-8 flex">
      {!isUpdateUserPressed ? (
        // ========================== user profile view ============================== //
        <div className="flex justify-center">
          <img className="w-52 mx-10" src={piggyBank} />
          <div className="flex flex-col items-start space-y-4">
            <p>My name: {userProfileAndBudget.user_name}</p>
            <p>My email: {userProfileAndBudget.user_email}</p>

            <p>
              My budget for the month:{" "}
              {new Intl.NumberFormat("en-SG", {
                style: "currency",
                currency: "SGD",
              }).format(userProfileAndBudget.budget_amt)}
            </p>
            {/* <p>My budget for the month: ${userCtx.budget}</p> */}

            {userCtx.expense > 0 ? (
              <p>
                My expense amount for current month:{" "}
                {new Intl.NumberFormat("en-SG", {
                  style: "currency",
                  currency: "SGD",
                }).format(userCtx.expense)}
              </p>
            ) : (
              <p>My expense amount for current month: $0</p>
            )}

            {userCtx.wishlistCost > 0 ? (
              <p>
                My wishlist Cost:{" "}
                {new Intl.NumberFormat("en-SG", {
                  style: "currency",
                  currency: "SGD",
                }).format(userCtx.wishlistCost)}
              </p>
            ) : (
              <p>My wishlist Cost: $0</p>
            )}
            <div className="flex space-x-4 py-4">
              <button
                className="button"
                onClick={() => setIsUpdateUserPressed(true)}
              >
                Update profile
              </button>
              <button className="button" onClick={deleteUser}>
                Delete profile (there is no going back)
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ========================== update user profile view ============================== //
        <div className="flex justify-center">
          <img className="w-52 mx-10" src={piggyBank} />
          <div className="flex flex-col items-start space-y-4">
            <div className="w-auto flex space-x-4">
              <label>My name: </label>
              <input
                id="user_name"
                type="text"
                value={updateUserProfile.user_name}
                onChange={handleChange}
              ></input>
            </div>

            <p>My email: {userProfileAndBudget.user_email}</p>

            <div className="w-auto flex space-x-4">
              <label>My budget for the month:</label>
              <div className="space-x-1">
                <label>$</label>
                <input
                  id="budget_amt"
                  type="text"
                  value={updateUserProfile.budget_amt}
                  // value={userCtx.budget}
                  onChange={handleChange}
                ></input>
              </div>
            </div>

            {userCtx.expense > 0 ? (
              <p>
                My expense amount for current month:{" "}
                {new Intl.NumberFormat("en-SG", {
                  style: "currency",
                  currency: "SGD",
                }).format(userCtx.expense)}
              </p>
            ) : (
              <p>My expense amount for current month: $0</p>
            )}
            {userCtx.wishlistCost > 0 ? (
              <p>
                My Wishlist Cost:{" "}
                {new Intl.NumberFormat("en-SG", {
                  style: "currency",
                  currency: "SGD",
                }).format(userCtx.wishlistCost)}
              </p>
            ) : (
              <p>My wishlist Cost: $0</p>
            )}
            <div className="flex space-x-4 py-4">
              <button className="button" onClick={updateUser}>
                Submit
              </button>
              <button
                className="button"
                onClick={() => setIsUpdateUserPressed(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
