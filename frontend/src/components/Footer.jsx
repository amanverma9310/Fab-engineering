import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiLoader } from "react-icons/fi";
import Logo from "./Logo";
import { useSettings } from "../context/SettingsContext";
import { normalizePhoneToE164, formatPhoneForDisplay } from "../utils/phone";

const exploreLinks = [
  { to: "/about", label: "About us" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/projects", label: "Projects" },
];

export default function Footer() {
  const { settings, loading } = useSettings();
  const social = settings.socialLinks || {};
  const hasSocial = social.facebook || social.instagram || social.linkedin || social.twitter;

  const phoneE164 = normalizePhoneToE164(settings.phone);
  const whatsappE164 = normalizePhoneToE164(settings.whatsapp);
  const phoneDisplay = formatPhoneForDisplay(settings.phone) || settings.phone;
  const whatsappDisplay = formatPhoneForDisplay(settings.whatsapp) || settings.whatsapp;

  const renderContactItem = (Icon, label, value, href, loading) => {
    if (loading || !value) {
      return (
        <li key={label} className="flex items-center gap-2 text-sm text-white/60">
          <Icon size={14} className="shrink-0" />
          <span className="flex items-center gap-2">
            <FiLoader className="animate-spin" size={12} />
            Loading…
          </span>
        </li>
      );
    }
    return (
      <li key={label}>
        <a href={href} className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <Icon size={14} className="shrink-0" />
          {value}
        </a>
      </li>
    );
  };

  return (
    <footer className="border-t border-white/10 bg-bg overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">{settings.footerText}</p>
            {hasSocial && (
              <div className="mt-6 flex items-center gap-3">
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                    <FiFacebook size={18} />
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                    <FiInstagram size={18} />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                    <FiLinkedin size={18} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                    <FiTwitter size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Explore</h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              {renderContactItem(FiPhone, "Phone", phoneDisplay, phoneE164 ? `tel:${phoneE164}` : null, loading || !settings.phone)}
              {renderContactItem(FiMail, "Email", settings.email, settings.email ? `mailto:${settings.email}` : null, loading || !settings.email)}
              <li className="flex items-start gap-2 text-sm text-white/60">
                <FiMapPin size={14} className="mt-0.5 shrink-0" />
                {loading || !settings.address ? (
                  <>
                    <FiLoader className="animate-spin" size={12} />
                    <span>Loading…</span>
                  </>
                ) : (
                  settings.address
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.
          </p>
          <p>Precision engineering, delivered reliably.</p>
        </div>
      </div>
    </footer>
  );
}
