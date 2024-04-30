import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const ProtectedRoute = ({ children }) => {
  useLocalStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin" || role === null) {
      navigate("/unauthorised");
    }
  }, []);

  return children;
};

export default ProtectedRoute;
