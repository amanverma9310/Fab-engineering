import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from "react-icons/fi";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

const emptyForm = {
  name: "",
  category: "",
  shortDescription: "",
  description: "",
  price: "",
  serviceType: "",
  features: "",
  specifications: "", // "key: value" per line
  isActive: true,
  featured: false,
  order: 0,
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product | "new" | null
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/products?all=true")
      .then((res) => setProducts(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setExistingImages([]);
    setNewFiles([]);
    setEditing("new");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price || "",
      serviceType: p.serviceType || "",
      features: (p.features || []).join("\n"),
      specifications: (p.specifications || []).map((s) => `${s.key}: ${s.value}`).join("\n"),
      isActive: p.isActive,
      featured: p.featured,
      order: p.order,
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
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("shortDescription", form.shortDescription);
    data.append("description", form.description);
    if (form.price) data.append("price", form.price);
    data.append("serviceType", form.serviceType);
    data.append(
      "features",
      JSON.stringify(form.features.split("\n").map((f) => f.trim()).filter(Boolean))
    );
    data.append(
      "specifications",
      JSON.stringify(
        form.specifications
          .split("\n")
          .map((line) => {
            const [key, ...rest] = line.split(":");
            return key && rest.length ? { key: key.trim(), value: rest.join(":").trim() } : null;
          })
          .filter(Boolean)
      )
    );
    data.append("isActive", form.isActive);
    data.append("featured", form.featured);
    data.append("order", form.order);
    existingImages.forEach((url) => data.append("existingImages", url));
    newFiles.forEach((f) => data.append("images", f));

    try {
      if (editing === "new") {
        await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product added successfully.");
      } else {
        await api.put(`/products/${editing._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated successfully.");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted.");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleActive = async (p) => {
    try {
      const res = await api.put(`/products/${p._id}`, { isActive: !p.isActive });
      setProducts((prev) => prev.map((x) => (x._id === p._id ? res.data : x)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products & Services</h1>
        <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs">
          <FiPlus size={14} /> Add Product
        </button>
      </div>
      <p className="mb-6 text-sm text-white/40">Shown live on the public Services page and homepage.</p>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-white/30">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-white/30">No products yet.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <img
                src={resolveImage(p.images?.[0])}
                alt={p.name}
                className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{p.name}</h3>
                  {p.featured && <FiStar size={12} className="shrink-0 text-amber-400" fill="currentColor" />}
                  {!p.isActive && (
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/40">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-white/40">{p.category}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button onClick={() => toggleActive(p)} className="text-xs text-white/50 hover:text-white">
                  {p.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => remove(p._id)} className="text-white/40 hover:text-red">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <form onSubmit={handleSubmit} className="my-8 w-full max-w-2xl rounded-xl border border-white/10 bg-[#0c0c0e] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-white">{editing === "new" ? "Add Product" : "Edit Product"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Category *</label>
                <input name="category" value={form.category} onChange={handleChange} required className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Short description *</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Full description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field resize-none" />
              </div>
              <div>
                <label className="label-field">Price (optional)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Service type</label>
                <input name="serviceType" value={form.serviceType} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Features (one per line)</label>
                <textarea name="features" value={form.features} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Specifications (one per line, "Key: Value")</label>
                <textarea
                  name="specifications"
                  value={form.specifications}
                  onChange={handleChange}
                  rows={3}
                  placeholder={"Thickness range: 0.5mm - 20mm\nTolerance: ± 0.1mm"}
                  className="input-field resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label-field">Images</label>
                {existingImages.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {existingImages.map((url, i) => (
                      <div key={url} className="relative">
                        <img src={resolveImage(url)} alt="" className="h-16 w-16 rounded-lg border border-white/10 object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute -right-1.5 -top-1.5 rounded-full bg-red p-0.5 text-white"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
                  className="text-xs text-white/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="label-field mb-0">Order</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} className="input-field w-24" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-red" />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-red" />
                  Featured
                </label>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary mt-6 w-full justify-center">
              {saving ? "Saving…" : "Save Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
