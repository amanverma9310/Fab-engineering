import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiInbox,
  FiMail,
  FiFolder,
  FiImage,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/inquiries", label: "Inquiries", icon: FiInbox },
  { to: "/admin/messages", label: "Messages", icon: FiMail },
  { to: "/admin/projects", label: "Projects", icon: FiFolder },
  { to: "/admin/gallery", label: "Gallery", icon: FiImage },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
  { to: "/admin/account", label: "Account", icon: FiUser },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const NavContent = () => (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <div className="font-display text-sm text-white">FAB ADMIN</div>
        <div className="mt-1 truncate text-xs text-white/40">{admin?.email}</div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <FiExternalLink size={16} /> View live site
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red/80 transition-colors hover:bg-red/10 hover:text-red"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0c0c0e] md:flex">
        <NavContent />
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0c0c0e] px-4 py-3 md:hidden">
        <span className="font-display text-sm">FAB ADMIN</span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-white/70">
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-white/10 bg-[#0c0c0e] pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 pt-20 sm:px-6 md:px-8 md:py-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
