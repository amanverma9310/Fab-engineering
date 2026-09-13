import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setForm(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSocialChange = (e) =>
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [e.target.name]: e.target.value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "socialLinks") data.append(key, JSON.stringify(value));
        else if (key !== "logo") data.append(key, value ?? "");
      });
      if (logoFile) data.append("logo", logoFile);

      const res = await api.put("/settings", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm(res.data);
      setLogoFile(null);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-white/30">Loading…</p>;
  if (!form) return <p className="text-sm text-red">Couldn't load settings.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Settings</h1>
      <p className="mb-6 text-sm text-white/40">
        Public site content. Sensitive credentials (DB, JWT, email, Cloudinary) live only in backend/.env.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={logoFile ? URL.createObjectURL(logoFile) : resolveImage(form.logo) || "/favicon.svg"}
            alt="Logo"
            className="h-16 w-16 rounded-lg border border-white/10 object-cover"
          />
          <div>
            <label className="label-field">Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="text-xs text-white/50" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Company name</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">WhatsApp</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Public email</label>
            <input name="email" value={form.email} onChange={handleChange} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Business hours</label>
            <input name="businessHours" value={form.businessHours} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="label-field">Hero heading</label>
          <input name="heroHeading" value={form.heroHeading} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label-field">Hero text</label>
          <textarea name="heroText" value={form.heroText} onChange={handleChange} rows={2} className="input-field resize-none" />
        </div>
        <div>
          <label className="label-field">About content</label>
          <textarea name="aboutContent" value={form.aboutContent} onChange={handleChange} rows={3} className="input-field resize-none" />
        </div>
        <div>
          <label className="label-field">Footer text</label>
          <textarea name="footerText" value={form.footerText} onChange={handleChange} rows={2} className="input-field resize-none" />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Social links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {["facebook", "instagram", "linkedin", "twitter"].map((key) => (
              <div key={key}>
                <label className="label-field capitalize">{key}</label>
                <input name={key} value={form.socialLinks?.[key] || ""} onChange={handleSocialChange} className="input-field" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
