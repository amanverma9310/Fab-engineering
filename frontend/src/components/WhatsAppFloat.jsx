import { FiMessageCircle } from "react-icons/fi";
import { useSettings } from "../context/SettingsContext";
import { buildWhatsAppLink } from "../utils/whatsapp";

export default function WhatsAppFloat() {
  const { settings } = useSettings();

  return (
    <a
      href={buildWhatsAppLink(settings.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent-green px-4 py-3 text-sm font-bold text-black shadow-lg shadow-black/30 transition-transform hover:scale-105"
    >
      <FiMessageCircle size={18} />
      Talk to an engineer
    </a>
  );
}
