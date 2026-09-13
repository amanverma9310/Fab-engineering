import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiCheckCircle, FiInbox, FiMail, FiClock, FiFolder } from "react-icons/fi";
import api from "../../services/api";

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">{label}</span>
        <Icon size={16} className="text-white/30" />
      </div>
      <div className="text-2xl font-bold text-white">{loading ? <span className="text-white/20">—</span> : value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/overview")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-white/40">Live data from MongoDB.</p>

      {error && <p className="mb-6 rounded-lg border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">{error}</p>}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FiBox} label="Total Products" value={data?.totalProducts ?? 0} loading={loading} />
        <StatCard icon={FiCheckCircle} label="Active Products" value={data?.activeProducts ?? 0} loading={loading} />
        <StatCard icon={FiInbox} label="Total Inquiries" value={data?.totalInquiries ?? 0} loading={loading} />
        <StatCard icon={FiClock} label="New Inquiries" value={data?.newInquiries ?? 0} loading={loading} />
        <StatCard icon={FiMail} label="Contact Messages" value={data?.totalMessages ?? 0} loading={loading} />
        <StatCard icon={FiMail} label="Unread Messages" value={data?.unreadMessages ?? 0} loading={loading} />
        <StatCard icon={FiFolder} label="Completed Inquiries" value={data?.completedInquiries ?? 0} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/80">Latest Inquiries</h2>
            <Link to="/admin/inquiries" className="text-xs text-white/40 hover:text-white">
              View all →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-white/30">Loading…</p>
          ) : !data?.latestInquiries?.length ? (
            <p className="text-sm text-white/30">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {data.latestInquiries.map((inq) => (
                <div key={inq._id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate text-white/85">{inq.customerName}</div>
                    <div className="truncate text-xs text-white/40">{inq.service}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/60">
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/80">Latest Messages</h2>
            <Link to="/admin/messages" className="text-xs text-white/40 hover:text-white">
              View all →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-white/30">Loading…</p>
          ) : !data?.latestMessages?.length ? (
            <p className="text-sm text-white/30">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {data.latestMessages.map((m) => (
                <div key={m._id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate text-white/85">{m.name}</div>
                    <div className="truncate text-xs text-white/40">{m.subject}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/60">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
