import { Navigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
