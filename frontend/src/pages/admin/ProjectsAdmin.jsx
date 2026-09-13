import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from "react-icons/fi";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

const emptyForm = { title: "", category: "", client: "", description: "", completedDate: "", featured: false, order: 0 };

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/projects").then((res) => setProjects(res.data)).catch((err) => toast.error(err.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setExistingImages([]); setNewFiles([]); setEditing("new"); };
  const openEdit = (p) => {
    setForm({
      title: p.title, category: p.category || "", client: p.client || "", description: p.description || "",
      completedDate: p.completedDate ? p.completedDate.slice(0, 10) : "", featured: p.featured, order: p.order,
    });
    setExistingImages(p.images || []);
    setNewFiles([]);
    setEditing(p);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    existingImages.forEach((url) => data.append("existingImages", url));
    newFiles.forEach((f) => data.append("images", f));

    try {
      if (editing === "new") {
        await api.post("/projects", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Project added.");
      } else {
        await api.put(`/projects/${editing._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Project updated.");
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
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
    toast.success("Project deleted.");
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs"><FiPlus size={14} /> Add Project</button>
      </div>
      <p className="mb-6 text-sm text-white/40">Case studies shown on the public Projects page.</p>

      <div className="space-y-3">
        {loading ? <p className="text-sm text-white/30">Loading…</p> : projects.length === 0 ? (
          <p className="text-sm text-white/30">No projects yet.</p>
        ) : projects.map((p) => (
          <div key={p._id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <img src={resolveImage(p.images?.[0])} alt={p.title} className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-white">{p.title}</h3>
                {p.featured && <FiStar size={12} className="shrink-0 text-amber-400" fill="currentColor" />}
              </div>
              <p className="truncate text-xs text-white/40">{p.category} {p.client && `· ${p.client}`}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white"><FiEdit2 size={15} /></button>
              <button onClick={() => remove(p._id)} className="text-white/40 hover:text-red"><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <form onSubmit={handleSubmit} className="my-8 w-full max-w-xl rounded-xl border border-white/10 bg-[#0c0c0e] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-white">{editing === "new" ? "Add Project" : "Edit Project"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><FiX size={18} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Client</label>
                <input name="client" value={form.client} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
              <div>
                <label className="label-field">Completed date</label>
                <input type="date" name="completedDate" value={form.completedDate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Order</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} className="input-field" />
              </div>

              <div className="sm:col-span-2">
                <label className="label-field">Images</label>
                {existingImages.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {existingImages.map((url, i) => (
                      <div key={url} className="relative">
                        <img src={resolveImage(url)} alt="" className="h-16 w-16 rounded-lg border border-white/10 object-cover" />
                        <button type="button" onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute -right-1.5 -top-1.5 rounded-full bg-red p-0.5 text-white">
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" multiple accept="image/*" onChange={(e) => setNewFiles(Array.from(e.target.files || []))} className="text-xs text-white/50" />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-red" />
                Featured
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary mt-6 w-full justify-center">
              {saving ? "Saving…" : "Save Project"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
