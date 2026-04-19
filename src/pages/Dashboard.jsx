import { useMemo } from "react";
import { TrendingUp, Send, MessageSquare, Trophy, Plus } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";
import JobCard from "../components/JobCard";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-zinc-50 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard({ jobs, loading, onSelectJob, onAddJob }) {
  const stats = useMemo(() => {
    const applied = jobs.filter((j) => j.status !== "Bookmarked").length;
    const interviewing = jobs.filter((j) => j.status === "Interviewing").length;
    const offers = jobs.filter((j) => j.status === "Offer").length;
    const bookmarked = jobs.filter((j) => j.status === "Bookmarked").length;
    return { applied, interviewing, offers, bookmarked };
  }, [jobs]);

  const recentJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [jobs]
  );

  const statusBreakdown = useMemo(() => {
    const total = jobs.length || 1;
    return Object.keys(STATUS_CONFIG).map((status) => {
      const count = jobs.filter((j) => j.status === status).length;
      return { status, count, pct: Math.round((count / total) * 100) };
    });
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Track your job search progress</p>
        </div>
        <button
          onClick={onAddJob}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={15} /> Add Job
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Send} label="Applied" value={stats.applied} color="bg-blue-600" />
        <StatCard icon={MessageSquare} label="Interviewing" value={stats.interviewing} color="bg-amber-500" />
        <StatCard icon={Trophy} label="Offers" value={stats.offers} color="bg-emerald-600" />
        <StatCard icon={TrendingUp} label="Bookmarked" value={stats.bookmarked} color="bg-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Status Breakdown */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {statusBreakdown.map(({ status, count, pct }) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">{status}</span>
                    <span className="text-zinc-500 tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Funnel conversion */}
          {jobs.length > 0 && (
            <div className="mt-5 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Applied → Interview rate</p>
              <p className="text-xl font-bold text-zinc-100">
                {stats.applied > 0
                  ? Math.round((stats.interviewing / stats.applied) * 100)
                  : 0}
                %
              </p>
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Recent Activity</h2>
          {recentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
              <p className="text-sm">No jobs tracked yet</p>
              <button
                onClick={onAddJob}
                className="mt-3 text-violet-400 hover:text-violet-300 text-sm underline"
              >
                Add your first job
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
