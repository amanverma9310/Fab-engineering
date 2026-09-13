import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Capabilities from "./pages/Capabilities";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import InquiriesAdmin from "./pages/admin/InquiriesAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import TeamAdmin from "./pages/admin/TeamAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import AccountAdmin from "./pages/admin/AccountAdmin";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#17181b", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
          success: { iconTheme: { primary: "#FF2D3A", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="account" element={<AccountAdmin />} />
        </Route>
      </Routes>
    </>
  );
}
