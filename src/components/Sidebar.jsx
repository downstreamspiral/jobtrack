import { LayoutDashboard, Briefcase, Plus, Target } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";

export default function Sidebar({ activePage, setActivePage, jobs, onAddJob }) {
  const counts = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {});

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "All Jobs", icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Target size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-50">
            Job<span className="text-violet-400">Track</span>
          </span>
        </div>
      </div>

      {/* Add Job Button */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={onAddJob}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus size={16} />
          Add Job
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 pt-4 space-y-0.5">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activePage === id
                ? "bg-zinc-800 text-zinc-50 font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Status Breakdown */}
      <div className="px-4 mt-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">
          By Status
        </p>
        <div className="space-y-1">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div
              key={status}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-xs text-zinc-400">{status}</span>
              </div>
              <span className="text-xs font-medium text-zinc-300 tabular-nums">
                {counts[status] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} tracked
        </p>
      </div>
    </aside>
  );
}
