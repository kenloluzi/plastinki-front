import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAdmin() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  if (!user || !user.is_admin) return <Navigate to="/" replace />;
  return <Outlet />;
}
