import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UserContext from "./context/user";
import UserLoginPage from "./pages.jsx/UserLoginPage";
import UserProfilePage from "./pages.jsx/UserProfilePage";
import RegisterUserPage from "./pages.jsx/RegisterUserPage";
import ExpensesPage from "./pages.jsx/ExpensesPage";
import NavBar from "./components/NavBar";
import WishlistPage from "./pages.jsx/WishlistPage";
import AdminLoginPage from "./pages.jsx/AdminLoginPage";
import RegisterAdminPage from "./pages.jsx/RegisterAdminPage";
import AdminViewPage from "./pages.jsx/AdminViewPage";
import AllUsersPage from "./pages.jsx/AllUsersPage";
import UnauthorisedPage from "./pages.jsx/UnauthorisedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [budget, setBudget] = useState(0);
  const [expense, setExpense] = useState(0);

  const location = useLocation();
  const showNavBar =
    location.pathname === "/profile" ||
    location.pathname === "/expenses" ||
    location.pathname == "/wishlist";

  return (
    <div>
      <UserContext.Provider
        value={{
          isLoggedIn,
          setIsLoggedIn,
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
          budget,
          setBudget,
          expense,
          setExpense,
        }}
      >
        {showNavBar && <NavBar></NavBar>}
        <Routes>
          <Route path="/" element={<UserLoginPage />} />
          <Route path="/register/user" element={<RegisterUserPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/*============================== Admin=====================================  */}

          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/register/admin" element={<RegisterAdminPage />} />
          <Route
            path="/view/admin"
            element={
              <ProtectedRoute>
                <AdminViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allusers/admin"
            element={
              <ProtectedRoute>
                <AllUsersPage />
              </ProtectedRoute>
            }
          />

          {/*============================== Unauthorised =====================================  */}

          <Route path="/unauthorised" element={<UnauthorisedPage />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
