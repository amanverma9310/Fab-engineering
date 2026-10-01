/**
 * Generates a Cloudinary URL with responsive transformations.
 * If Cloudinary is not configured, returns the original URL.
 */
export function getCloudinaryImageUrl(url, options = {}) {
  if (!url) return url;

  // Check if it's already a Cloudinary URL
  if (!url.includes("res.cloudinary.com")) return url;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  // Insert transformations into the Cloudinary URL
  // Format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>
  const uploadIndex = url.indexOf("/image/upload/");
  if (uploadIndex === -1) return url;

  const base = url.slice(0, uploadIndex + "/image/upload/".length);
  const rest = url.slice(uploadIndex + "/image/upload/".length);

  const transformations = [];
  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);

  if (transformations.length === 0) return url;

  return `${base}${transformations.join(",")}/${rest}`;
}

/**
 * Generates a responsive srcSet for Cloudinary images.
 */
export function getCloudinarySrcSet(url, widths = [400, 800, 1200, 1600]) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return null;
  }

  return widths
    .map((w) => `${getCloudinaryImageUrl(url, { width: w, format: "auto", quality: "auto" })} ${w}w`)
    .join(", ");
}

/**
 * Generates sizes attribute for responsive images.
 */
export function getResponsiveSizes(breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 }) {
  return `(max-width: ${breakpoints.sm}px) 100vw, (max-width: ${breakpoints.md}px) 50vw, (max-width: ${breakpoints.lg}px) 33vw, 25vw`;
}