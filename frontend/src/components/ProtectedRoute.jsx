import React, { useContext, useEffect } from "react";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userCtx.role !== "admin" || userCtx.role === null) {
      navigate("/unauthorised");
    }
  }, []);

  return children;
};

export default ProtectedRoute;
