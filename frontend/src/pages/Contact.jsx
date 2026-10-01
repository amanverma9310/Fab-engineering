import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin, FiArrowUpRight, FiLoader } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import { useSettings } from "../context/SettingsContext";
import api, { ensureCsrfToken } from "../services/api";
import Seo from "../components/Seo";
import { normalizePhoneToE164, formatPhoneForDisplay } from "../utils/phone";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export default function Contact() {
  const { settings, loading: settingsLoading } = useSettings();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureCsrfToken().catch(() => {});
  }, []);

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

  const phoneE164 = normalizePhoneToE164(settings.phone);
  const whatsappE164 = normalizePhoneToE164(settings.whatsapp);
  const phoneDisplay = formatPhoneForDisplay(settings.phone) || settings.phone;
  const whatsappDisplay = formatPhoneForDisplay(settings.whatsapp) || settings.whatsapp;

  const infoItems = settingsLoading
    ? [
        { icon: <FiPhone size={18} />, label: "Phone", value: "—", href: null, loading: true },
        { icon: <FiMessageCircle size={18} />, label: "WhatsApp", value: "—", href: null, loading: true },
        { icon: <FiMail size={18} />, label: "Email", value: "—", href: null, loading: true },
        { icon: <FiMapPin size={18} />, label: "Visit", value: "—", href: null, loading: true },
      ]
    : [
        { icon: <FiPhone size={18} />, label: "Phone", value: phoneDisplay, href: phoneE164 ? `tel:${phoneE164}` : null },
        { icon: <FiMessageCircle size={18} />, label: "WhatsApp", value: whatsappDisplay, href: whatsappE164 ? `https://wa.me/${whatsappE164.replace(/^\+/, "")}` : null },
        { icon: <FiMail size={18} />, label: "Email", value: settings.email, href: settings.email ? `mailto:${settings.email}` : null },
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
                  {item.loading ? (
                    <div className="flex items-center gap-2 text-white/50">
                      <FiLoader className="animate-spin" size={16} />
                      <span>Loading…</span>
                    </div>
                  ) : item.href ? (
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
                <label htmlFor="contact-name" className="label-field">Name *</label>
                <input id="contact-name" name="name" value={form.name} onChange={handleChange} required className="input-field" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="label-field">Email *</label>
                <input type="email" id="contact-email" name="email" value={form.email} onChange={handleChange} required className="input-field" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="contact-phone" className="label-field">Phone</label>
                <input id="contact-phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" autoComplete="tel" inputMode="tel" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="label-field">Subject</label>
                <input id="contact-subject" name="subject" value={form.subject} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="contact-message" className="label-field">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                rows={6}
                className="input-field resize-none"
                aria-describedby="contact-message-hint"
              />
              <p id="contact-message-hint" className="mt-1 text-xs text-white/40">Minimum 10 characters</p>
            </div>
            {/* Honeypot field - hidden from humans, catches bots */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px", pointerEvents: "none" }}
              aria-hidden="true"
            />
            <button type="submit" disabled={submitting} className="btn-primary mt-8">
              {submitting ? "Sending..." : "Send message"} <FiArrowUpRight />
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
