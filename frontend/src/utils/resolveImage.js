import { SERVER_ORIGIN } from "../services/api";
import { getCloudinaryImageUrl } from "./cloudinary";

/** Resolves a stored image path into a URL the <img> tag can load. */
export function resolveImage(pathOrUrl, options) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return getCloudinaryImageUrl(pathOrUrl, options); // Cloudinary or any absolute URL
  return `${SERVER_ORIGIN}${pathOrUrl}`; // local "/uploads/..." path
}
