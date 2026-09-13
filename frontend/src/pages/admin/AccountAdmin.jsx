import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function AccountAdmin() {
  const { admin, checkAuth } = useAuth();
  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation don't match.");
      return;
    }
    if (form.newPassword && !form.currentPassword) {
      toast.error("Enter your current password to set a new one.");
      return;
    }

    setSaving(true);
    try {
      await api.put("/auth/profile", {
        name: form.name,
        email: form.email,
        ...(form.newPassword && {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      toast.success("Profile updated successfully.");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      await checkAuth?.(); // refresh admin name/email shown in the sidebar
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-2xl font-bold">Account</h1>
      <p className="mb-6 text-sm text-white/40">Update your admin name, email, or password.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-field">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
        </div>

        <div className="border-t border-white/10 pt-5">
          <h2 className="mb-1 text-sm font-bold text-white">Change password</h2>
          <p className="mb-4 text-xs text-white/40">Leave these blank to keep your current password.</p>

          <div className="space-y-4">
            <div>
              <label className="label-field">Current password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">New password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Confirm new password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="input-field"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
