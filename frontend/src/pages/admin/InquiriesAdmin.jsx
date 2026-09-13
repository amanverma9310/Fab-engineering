import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiTrash2, FiDownload } from "react-icons/fi";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";

const STATUSES = ["All", "New", "Reviewing", "Contacted", "Quoted", "Approved", "In Progress", "Completed", "Rejected"];

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status !== "All") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());
      const res = await api.get(`/inquiries?${params}`);
      setInquiries(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openDetail = (inq) => {
    setSelected(inq);
    setNotes(inq.adminNotes || "");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/inquiries/${id}/status`, { status: newStatus });
      setInquiries((prev) => prev.map((i) => (i._id === id ? res.data : i)));
      if (selected?._id === id) setSelected(res.data);
      toast.success("Status updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const saveNotes = async () => {
    try {
      const res = await api.put(`/inquiries/${selected._id}`, { adminNotes: notes });
      setSelected(res.data);
      toast.success("Notes saved.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      setSelected(null);
      toast.success("Inquiry deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Inquiries</h1>
      <p className="mb-6 text-sm text-white/40">Product, service and quote requests from your site.</p>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              status === s ? "border-red bg-red text-white" : "border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="relative ml-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, name, email, phone"
            className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
          />
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-white/40">
              <th className="px-4 py-3 font-medium">Inquiry ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Phone</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Service</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">No inquiries found.</td></tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq._id} onClick={() => openDetail(inq)} className="cursor-pointer border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-white/70">{inq.inquiryId}</td>
                  <td className="px-4 py-3 text-white/85">{inq.customerName}</td>
                  <td className="hidden px-4 py-3 text-white/60 sm:table-cell">{inq.phone}</td>
                  <td className="hidden max-w-[160px] truncate px-4 py-3 text-white/60 md:table-cell">{inq.service}</td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-white/40 sm:table-cell">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">{inq.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => load(p)}
              className={`h-8 w-8 rounded-lg text-xs font-medium ${
                pagination.page === p ? "bg-white text-black" : "text-white/50 hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div className="my-8 w-full max-w-xl rounded-xl border border-white/10 bg-[#0c0c0e] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-mono text-sm text-white/60">{selected.inquiryId}</h3>
                <h2 className="text-lg font-bold text-white">{selected.customerName}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Email" value={selected.email} />
              <Info label="Phone" value={selected.phone} />
              <Info label="WhatsApp" value={selected.whatsapp} />
              <Info label="Company" value={selected.companyName} />
              <Info label="Service" value={selected.service} />
              <Info label="Quantity" value={selected.quantity} />
              <Info label="Material" value={selected.material} />
              <Info label="Expected date" value={selected.expectedDate ? new Date(selected.expectedDate).toLocaleDateString() : ""} />
            </div>

            {selected.description && (
              <div className="mt-4">
                <p className="text-xs text-white/40">Description</p>
                <p className="mt-1 text-sm text-white/80">{selected.description}</p>
              </div>
            )}
            {selected.projectDetails && (
              <div className="mt-4">
                <p className="text-xs text-white/40">Project details</p>
                <p className="mt-1 text-sm text-white/80">{selected.projectDetails}</p>
              </div>
            )}

            {selected.attachments?.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-white/40">Attachments</p>
                <div className="space-y-2">
                  {selected.attachments.map((a, i) => (
                    <a
                      key={i}
                      href={resolveImage(a.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2 text-sm text-white/70 hover:text-white"
                    >
                      <span className="truncate">{a.filename}</span>
                      <FiDownload size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="label-field">Status</label>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected._id, e.target.value)}
                className="input-field"
              >
                {STATUSES.filter((s) => s !== "All").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="label-field">Admin notes (private)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field resize-none" />
              <button onClick={saveNotes} className="btn-outline mt-2 !px-4 !py-2 text-xs">
                Save notes
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <a href={`mailto:${selected.email}`} className="text-xs text-blue-400 hover:text-blue-300">
                Email customer →
              </a>
              <button onClick={() => remove(selected._id)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red">
                <FiTrash2 size={13} /> Delete inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-white/80">{value}</p>
    </div>
  );
}
