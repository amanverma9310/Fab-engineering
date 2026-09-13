import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";
import Seo from "../components/Seo";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent successfully.");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    { icon: <FiPhone size={18} />, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: <FiMessageCircle size={18} />, label: "WhatsApp", value: settings.whatsapp, href: `https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}` },
    { icon: <FiMail size={18} />, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: <FiMapPin size={18} />, label: "Visit", value: settings.address, href: null },
  ];

  return (
    <div>
      <Seo
        title="Contact Us"
        description="Get in touch with FAB Engineering for quotes, inquiries and project discussions."
        path="/contact"
      />
      <PageHeader
        eyebrow="GET IN TOUCH"
        heading="A conversation"
        accentLine="starts here."
        text="Tell us what you're working on. Whether it's a drawing, a rough idea or a production question, we're listening."
      />

      <section className="bg-bg pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="divide-y divide-white/10 border-t border-white/10"
          >
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 py-6">
                <span className="mt-0.5 text-red">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-base font-bold text-white hover:text-red">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-base font-bold text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label-field">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="mt-6">
              <label className="label-field">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                rows={6}
                className="input-field resize-none"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-8">
              {submitting ? "Sending..." : "Send message"} <FiArrowUpRight />
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
