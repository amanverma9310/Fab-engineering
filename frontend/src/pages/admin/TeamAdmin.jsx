import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

const emptyForm = { name: "", role: "", bio: "", linkedin: "", order: 0 };

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // member | "new" | null
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/team")
      .then((res) => setMembers(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setPhotoFile(null);
    setEditing("new");
  };

  const openEdit = (m) => {
    setForm({ name: m.name, role: m.role, bio: m.bio || "", linkedin: m.linkedin || "", order: m.order });
    setPhotoFile(null);
    setEditing(m);
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing === "new" && !photoFile) {
      toast.error("Please choose a photo.");
      return;
    }
    setSaving(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (photoFile) data.append("photo", photoFile);

    try {
      if (editing === "new") {
        await api.post("/team", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Team member added.");
      } else {
        await api.put(`/team/${editing._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Team member updated.");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this team member?")) return;
    try {
      await api.delete(`/team/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      toast.success("Team member removed.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team</h1>
        <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs">
          <FiPlus size={14} /> Add Member
        </button>
      </div>
      <p className="mb-6 text-sm text-white/40">Shown in the "People behind the work" section on the About page.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-white/30">Loading…</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-white/30">No team members yet.</p>
        ) : (
          members.map((m) => (
            <div key={m._id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <img src={resolveImage(m.photo)} alt={m.name} className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-white">{m.name}</h3>
                <p className="truncate text-xs text-white/40">{m.role}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button onClick={() => openEdit(m)} className="text-white/40 hover:text-white">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => remove(m._id)} className="text-white/40 hover:text-red">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <form onSubmit={handleSubmit} className="my-8 w-full max-w-md rounded-xl border border-white/10 bg-[#0c0c0e] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-white">{editing === "new" ? "Add Team Member" : "Edit Team Member"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-field">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Role *</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  placeholder="CEO, Co-Founder, Head of Operations, Lead Designer, Tech Lead…"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Short bio (optional)</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="label-field">LinkedIn URL (optional)</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Order</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} className="input-field w-24" />
              </div>

              <div>
                <label className="label-field">Photo {editing === "new" && "*"}</label>
                {editing !== "new" && !photoFile && (
                  <img src={resolveImage(editing.photo)} alt="" className="mb-2 h-16 w-16 rounded-full border border-white/10 object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="text-xs text-white/50"
                />
                <p className="mt-1 text-[11px] text-white/30">Square headshots look best (e.g. 500×500px).</p>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary mt-6 w-full justify-center">
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
