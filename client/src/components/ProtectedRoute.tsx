import type React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
	children: React.ReactNode;
	isAuthenticated: boolean;
}

function ProtectedRoute({ children, isAuthenticated }: ProtectedRouteProps) {
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
