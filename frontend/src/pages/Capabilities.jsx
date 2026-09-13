import { FiShield, FiTool, FiSettings, FiTruck, FiHeadphones } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import FeatureListSection from "../components/FeatureListSection";
import CTABanner from "../components/CTABanner";

const items = [
  { icon: <FiShield size={15} />, title: "Precision Engineering", description: "Clear thinking and careful execution at every stage." },
  { icon: <FiTool size={15} />, title: "Quality Fabrication", description: "Work checked against drawing before it ships." },
  { icon: <FiSettings size={15} />, title: "Custom Solutions", description: "Every job scoped to the part, not a fixed template." },
  { icon: <FiTruck size={15} />, title: "Reliable Delivery", description: "Timelines set up front and communicated clearly." },
  { icon: <FiHeadphones size={15} />, title: "Technical Support", description: "Direct access to the people building your parts." },
];

export default function Capabilities() {
  return (
    <div>
      <PageHeader
        eyebrow="CAPABILITIES"
        heading="A capable shop"
        accentLine="floor.."
        text="From sheet metal parts and machine components to welding, prototype manufacturing and custom metal components — bring the requirement, we'll shape the route."
      />
      <FeatureListSection
        eyebrow="EQUIPPED FOR IT"
        heading="Process and"
        accentWord="equipment that scale."
        image="/images/capabilities-workshop.jpg"
        items={items}
        imageOnRight
        ctaLabel="See our services"
        ctaTo="/services"
      />
      <CTABanner />
    </div>
  );
}
