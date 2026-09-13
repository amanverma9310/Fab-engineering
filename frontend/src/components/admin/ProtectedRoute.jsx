import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-sm text-white/40">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
