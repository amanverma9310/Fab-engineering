import { Helmet } from "react-helmet-async";

const SITE_NAME = "FAB Engineering";
const SITE_URL = "https://frontend-aman-9df7.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-1.jpg`;

/**
 * Drop <Seo title="..." description="..." /> at the top of every page component.
 * path should start with "/" e.g. "/services" or `/services/${slug}`.
 */
export default function Seo({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Precision Fabrication & Custom Manufacturing`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE };
