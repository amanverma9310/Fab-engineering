import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
            <FiLock className="text-white/70" size={18} />
          </div>
          <h1 className="font-display text-xl">FAB ADMIN</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to manage the site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              className="input-field"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              className="input-field"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red/20 bg-red/10 px-3 py-2 text-sm text-red">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
