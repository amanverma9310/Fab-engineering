import { FiShield, FiTool, FiSettings, FiTruck, FiHeadphones } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import FeatureListSection from "../components/FeatureListSection";
import CTABanner from "../components/CTABanner";
import { useSettings } from "../context/SettingsContext";
import Seo from "../components/Seo";

const items = [
  { icon: <FiShield size={15} />, title: "Precision Engineering", description: "Clear thinking and careful execution at every stage." },
  { icon: <FiTool size={15} />, title: "Quality Fabrication", description: "Work checked against drawing before it ships." },
  { icon: <FiSettings size={15} />, title: "Custom Solutions", description: "Every job scoped to the part, not a fixed template." },
  { icon: <FiTruck size={15} />, title: "Reliable Delivery", description: "Timelines set up front and communicated clearly." },
  { icon: <FiHeadphones size={15} />, title: "Technical Support", description: "Direct access to the people building your parts." },
];

export default function About() {
  const { settings } = useSettings();

  return (
    <div>
      <Seo
        title="About Us"
        description="Learn about FAB Engineering's precision engineering, quality fabrication and custom manufacturing capabilities."
        path="/about"
      />
      <PageHeader
        eyebrow="ABOUT FAB ENGINEERING"
        heading="Engineering made"
        accentLine="practical.."
        text={settings.aboutContent}
      />
      <FeatureListSection
        eyebrow="HOW WE WORK"
        heading="Built around"
        accentWord="your requirement."
        image="/images/about-workshop.jpg"
        items={items}
      />
      <CTABanner />
    </div>
  );
}
