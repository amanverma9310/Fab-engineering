import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <span className="heading-display text-6xl text-red">404</span>
      <h1 className="heading-display mt-4 text-3xl text-white">Page not found.</h1>
      <p className="mt-3 text-white/50">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
