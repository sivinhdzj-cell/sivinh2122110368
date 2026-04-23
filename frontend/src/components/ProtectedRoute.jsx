import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
