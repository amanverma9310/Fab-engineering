import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

export default function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 py-20 text-center">
      <p className="text-white/50">
        {message}{" "}
        {actionTo && (
          <Link to={actionTo} className="inline-flex items-center gap-1 font-semibold text-red hover:underline">
            {actionLabel} <FiArrowUpRight size={14} />
          </Link>
        )}
      </p>
    </div>
  );
}
