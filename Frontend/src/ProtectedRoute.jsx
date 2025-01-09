import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Get the role from localStorage

  useEffect(() => {
    if (!role) {
      // If the user is not logged in, redirect to the login page
      navigate("/login");
    }
  }, [role, navigate]);

  return <>{children}</>;
};
export default ProtectedRoute;