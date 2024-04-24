import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "./context/user";
import LoginPage from "./pages.jsx/UserLoginPage";
import UserProfilePage from "./pages.jsx/UserProfilePage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
        {/* <LoginPage></LoginPage> */}
      </UserContext.Provider>
    </div>
  );
}

export default App;
