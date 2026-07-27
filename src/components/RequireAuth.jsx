import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner component

  const userRoles = (auth?.roles || []).map((r) => String(r));
  const allowed = (allowedRoles || []).map((r) => String(r));
  const hasRole = userRoles.some((r) => allowed.includes(r));

  return hasRole ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
