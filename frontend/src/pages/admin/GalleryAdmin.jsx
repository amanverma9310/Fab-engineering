import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiTrash2, FiX } from "react-icons/fi";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);

  const load = () => {
    setLoading(true);
    api.get("/gallery").then((res) => setImages(res.data)).catch((err) => toast.error(err.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast.error("Choose at least one image.");
      return;
    }
    setUploading(true);
    const data = new FormData();
    if (caption) data.append("caption", caption);
    if (category) data.append("category", category);
    files.forEach((f) => data.append("images", f));

    try {
      await api.post("/gallery", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Images uploaded.");
      setCaption("");
      setCategory("");
      setFiles([]);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this image?")) return;
    await api.delete(`/gallery/${id}`);
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Gallery</h1>
      <p className="mb-6 text-sm text-white/40">Workshop and product photos shown on the public Gallery page.</p>

      <form onSubmit={handleUpload} className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Caption (optional, applies to all selected)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Category (optional)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="Shop Floor, Product, Office…" />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-6 py-6 text-center hover:border-white/40">
            <FiUpload size={18} className="text-white/40" />
            <span className="text-sm text-white/50">
              {files.length ? `${files.length} image(s) selected` : "Choose images to upload"}
            </span>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" />
          </label>
        </div>
        <button type="submit" disabled={uploading} className="btn-primary mt-4 !px-4 !py-2 text-xs">
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-white/30">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-white/30">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img._id} className="group relative overflow-hidden rounded-lg border border-white/10">
              <img src={resolveImage(img.image)} alt={img.caption || ""} className="aspect-square w-full object-cover" />
              <button
                onClick={() => remove(img._id)}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <FiX size={14} />
              </button>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[11px] text-white/80">{img.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
