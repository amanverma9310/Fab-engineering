import { Link } from "react-router-dom";
import { resolveImage } from "../utils/resolveImage";
import { useSettings } from "../context/SettingsContext";

export default function Logo({ dark }) {
  const { settings } = useSettings();
  const initial = (settings.companyName || "FAB").trim().charAt(0).toUpperCase();

  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      {settings.logo ? (
        <img src={resolveImage(settings.logo)} alt={settings.companyName} className="h-9 w-9 rounded object-cover" />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red font-display text-lg text-white">
          {initial}
        </span>
      )}
      <span className="leading-tight">
        <span className="block font-display text-lg tracking-wide text-white">
          {(settings.companyName || "FAB").split(" ")[0]}.
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.2em] text-white/50">
          {settings.companyName?.split(" ").slice(1).join(" ") || "ENGINEERING"}
        </span>
      </span>
    </Link>
  );
}
