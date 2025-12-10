import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Normalize both sides to strings to avoid number/string mismatches from backend
  const userRoles = (auth?.roles || []).map((r) => String(r));
  const allowed = (allowedRoles || []).map((r) => String(r));
  const hasRole = userRoles.some((r) => allowed.includes(r));

  return hasRole ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
