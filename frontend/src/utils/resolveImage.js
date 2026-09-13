import { SERVER_ORIGIN } from "../services/api";

/** Resolves a stored image path into a URL the <img> tag can load. */
export function resolveImage(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // Cloudinary or any absolute URL
  return `${SERVER_ORIGIN}${pathOrUrl}`; // local "/uploads/..." path
}
