import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "./context/user";
import LoginPage from "./pages.jsx/UserLoginPage";
import UserProfilePage from "./pages.jsx/UserProfilePage";
import RegisterUserPage from "./pages.jsx/RegisterUserPage";
import ExpensesPage from "./pages.jsx/ExpensesPage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [expensesAmt, setExpenseAmt] = useState();

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
          <Route
            path="/"
            element={<LoginPage setExpenseAmt={setExpenseAmt} />}
          />
          <Route path="/register/user" element={<RegisterUserPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
