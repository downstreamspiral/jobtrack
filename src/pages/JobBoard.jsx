import { useState, useMemo } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";
import JobCard from "../components/JobCard";

export default function JobBoard({
  jobs,
  loading,
  filterStatus,
  setFilterStatus,
  onSelectJob,
  onAddJob,
  onUpdateJob,
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const statuses = ["all", ...Object.keys(STATUS_CONFIG)];

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (filterStatus !== "all") list = list.filter((j) => j.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q) ||
          (j.location || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "company") list.sort((a, b) => a.company.localeCompare(b.company));
    return list;
  }, [jobs, filterStatus, search, sortBy]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">All Jobs</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {filtered.length} of {jobs.length} jobs
          </p>
        </div>
        <button
          onClick={onAddJob}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={15} /> Add Job
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search company, role, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-8 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {statuses.map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = s === "all" ? jobs.length : jobs.filter((j) => j.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {s === "all" ? "All" : s}{" "}
              <span className={`ml-1 ${filterStatus === s ? "text-violet-200" : "text-zinc-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-lg">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new job</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => onSelectJob(job)} />
          ))}
        </div>
      )}
    </div>
  );
}
