import { MapPin, DollarSign, ExternalLink } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";
import { timeAgo } from "../utils/date";

export default function JobCard({ job, onClick, compact = false }) {
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG["Bookmarked"];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors text-left group"
      >
        <div className="w-8 h-8 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0">
          {job.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">{job.role}</p>
          <p className="text-xs text-zinc-500 truncate">{job.company}</p>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
          {job.status}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-left transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company Avatar */}
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 shrink-0">
            {job.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-violet-300 transition-colors">
                {job.role}
              </h3>
              {job.url && (
                <ExternalLink
                  size={12}
                  className="text-zinc-600 group-hover:text-zinc-400 shrink-0"
                />
              )}
            </div>
            <p className="text-sm text-zinc-400 mt-0.5">{job.company}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {job.location && (
                <span className="flex items-center gap-1 text-xs text-zinc-600">
                  <MapPin size={11} /> {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1 text-xs text-zinc-600">
                  <DollarSign size={11} /> {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
            {job.status}
          </span>
          <span className="text-xs text-zinc-600">{timeAgo(job.created_at)}</span>
        </div>
      </div>
      {job.notes && (
        <p className="mt-2.5 text-xs text-zinc-600 line-clamp-1 pl-13">{job.notes}</p>
      )}
    </button>
  );
}
