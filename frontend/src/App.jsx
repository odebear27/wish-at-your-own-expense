import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UserContext from "./context/user";
import LoginPage from "./pages.jsx/UserLoginPage";
import UserProfilePage from "./pages.jsx/UserProfilePage";
import RegisterUserPage from "./pages.jsx/RegisterUserPage";
import ExpensesPage from "./pages.jsx/ExpensesPage";
import NavBar from "./components/NavBar";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const location = useLocation();
  const showNavBar =
    location.pathname !== "/" && location.pathname !== "/register/user";

  return (
    <div>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          refreshToken,
          setRefreshToken,
          role,
          setRole,
          userId,
          setUserId,
          userEmail,
          setUserEmail,
        }}
      >
        {showNavBar && <NavBar></NavBar>}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register/user" element={<RegisterUserPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
