import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../context/user";

const NavBar = () => {
  const userCtx = useContext(UserContext);

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
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full mx-auto flex flex-row py-6 h-16 items-center justify-around bg-colour-white">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "hover:text-colour-darkBluishGrey hover:decoration-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10 underline decoration-solid decoration-colour-slate decoration-2 underline-offset-8"
              : "hover:text-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10"
          }
          to="/expenses"
        >
          My Expenses
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "hover:text-colour-darkBluishGrey hover:decoration-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10 underline decoration-solid decoration-colour-slate decoration-2 underline-offset-8"
              : "hover:text-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10"
          }
          to="/wishlist"
        >
          My Wishlist
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "hover:text-colour-darkBluishGrey hover:decoration-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10 underline decoration-solid decoration-colour-slate decoration-2 underline-offset-8"
              : "hover:text-colour-darkBluishGrey text-colour-slate mb-5 font-bold pt-10"
          }
          to="/profile"
        >
          {userCtx.userEmail}
        </NavLink>
        <NavLink to="/">
          <button
            onClick={() => {
              handleLogout();
            }}
          >
            Log Out
          </button>
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
