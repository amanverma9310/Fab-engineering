import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const defaultSettings = {
  companyName: "FAB Engineering",
  logo: "",
  phone: "93115 75271",
  whatsapp: "+91 78178 27362",
  email: "abhiverma9315@gmail.com",
  address: "Tughlakabad Gaun, Delhi",
  heroHeading: "Precision Engineering. Built to Perform.",
  heroText:
    "Laser cutting, sheet metal fabrication, bending and custom manufacturing for teams that need dependable results.",
  aboutContent:
    "FAB Engineering provides mechanical design, laser cutting, sheet metal fabrication, bending, powder coating and custom engineering solutions from Tughlakabad Sarai, Delhi.",
  businessHours: "Mon – Sat, 9:00 AM – 7:00 PM",
  socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
  footerText: "Precision fabrication and practical engineering for the parts that keep business moving.",
};

const SettingsContext = createContext({ settings: defaultSettings, loading: true });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings({ ...defaultSettings, ...res.data }))
      .catch(() => {
        // Backend unreachable — keep sensible defaults so the site still renders.
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
