import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "./context/user";
import LoginPage from "./pages.jsx/UserLoginPage";

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
        </Routes>
        {/* <LoginPage></LoginPage> */}
      </UserContext.Provider>
    </div>
  );
}

export default App;
