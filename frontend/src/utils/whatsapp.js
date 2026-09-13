/** Builds a wa.me link with a dynamically generated, non-hardcoded message. */
export function buildWhatsAppLink(whatsappNumber, serviceOrProductName) {
  const digits = (whatsappNumber || "").replace(/[^\d]/g, "");
  const message = serviceOrProductName
    ? `Hello, I am interested in ${serviceOrProductName}. Please share more details.`
    : "Hello, I'd like to know more about FAB Engineering's services.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
