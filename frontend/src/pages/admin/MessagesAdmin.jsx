import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";

const STATUSES = ["All", "New", "Read", "Replied"];

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status !== "All") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());
      const res = await api.get(`/contact?${params}`);
      setMessages(res.data);
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

  const openMessage = async (m) => {
    setSelected(m);
    if (m.status === "New") {
      const res = await api.put(`/contact/${m._id}`, { status: "Read" });
      setMessages((prev) => prev.map((x) => (x._id === m._id ? res.data : x)));
      setSelected(res.data);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const res = await api.put(`/contact/${id}`, { status: newStatus });
    setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    setSelected(res.data);
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/contact/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    setSelected(null);
    toast.success("Message deleted.");
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Messages</h1>
      <p className="mb-6 text-sm text-white/40">General contact form submissions.</p>

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
            placeholder="Search name, email, subject"
            className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
          />
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-white/40">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Subject</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">No messages found.</td></tr>
            ) : (
              messages.map((m) => (
                <tr key={m._id} onClick={() => openMessage(m)} className="cursor-pointer border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="max-w-[140px] truncate px-4 py-3 text-white/85">{m.name}</td>
                  <td className="hidden max-w-[180px] truncate px-4 py-3 text-white/60 sm:table-cell">{m.email}</td>
                  <td className="hidden max-w-[220px] truncate px-4 py-3 text-white/60 md:table-cell">{m.subject}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">{m.status}</span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-white/40 sm:table-cell">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); remove(m._id); }} className="text-white/30 hover:text-red">
                      <FiTrash2 size={14} />
                    </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0c0c0e] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{selected.subject || "(No subject)"}</h3>
                <p className="mt-1 text-xs text-white/40">
                  {selected.name} · {selected.email} {selected.phone && `· ${selected.phone}`}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <p className="mb-5 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{selected.message}</p>

            <div className="flex flex-wrap items-center gap-2">
              {STATUSES.filter((s) => s !== "All").map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected._id, s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected.status === s ? "border-red bg-red text-white" : "border-white/15 text-white/60 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
              <a href={`mailto:${selected.email}`} className="ml-auto text-xs text-blue-400 hover:text-blue-300">
                Reply by email →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
