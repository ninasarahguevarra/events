import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/authUtils";

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = getAuth();
    console.log(isAuthenticated);
    
    return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
