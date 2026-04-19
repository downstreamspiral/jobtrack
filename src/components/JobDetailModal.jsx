import { useState } from "react";
import { X, ExternalLink, Trash2, Edit2, Check, MapPin, DollarSign, Calendar } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";
import { formatDate } from "../utils/date";

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors";

export default function JobDetailModal({ job, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...job });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG["Bookmarked"];

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(job.id, form);
    setEditing(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    await onDelete(job.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
              {job.company[0]}
            </div>
            <div>
              {editing ? (
                <input
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm font-semibold text-zinc-100 focus:outline-none focus:border-violet-500 w-48"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                />
              ) : (
                <h2 className="font-semibold text-zinc-100 text-sm">{job.role}</h2>
              )}
              {editing ? (
                <input
                  className="mt-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-400 focus:outline-none focus:border-violet-500 w-32"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              ) : (
                <p className="text-xs text-zinc-500">{job.company}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status */}
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1.5">Status</p>
            {editing ? (
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {Object.keys(STATUS_CONFIG).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
                {job.status}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1.5 flex items-center gap-1">
                <MapPin size={11} /> Location
              </p>
              {editing ? (
                <input
                  className={inputClass}
                  value={form.location || ""}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Remote"
                />
              ) : (
                <p className="text-sm text-zinc-300">{job.location || "—"}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1.5 flex items-center gap-1">
                <DollarSign size={11} /> Salary
              </p>
              {editing ? (
                <input
                  className={inputClass}
                  value={form.salary || ""}
                  onChange={(e) => set("salary", e.target.value)}
                  placeholder="e.g. $120k"
                />
              ) : (
                <p className="text-sm text-zinc-300">{job.salary || "—"}</p>
              )}
            </div>
          </div>

          {/* URL */}
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1.5">Job URL</p>
            {editing ? (
              <input
                className={inputClass}
                value={form.url || ""}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://..."
              />
            ) : job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                View posting <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-zinc-600">—</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1.5">Notes</p>
            {editing ? (
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={form.notes || ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any notes..."
              />
            ) : (
              <p className="text-sm text-zinc-400 leading-relaxed">
                {job.notes || <span className="text-zinc-600 italic">No notes yet</span>}
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="flex gap-4 pt-2 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-600 flex items-center gap-1">
                <Calendar size={10} /> Added
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{formatDate(job.created_at)}</p>
            </div>
            {job.applied_at && (
              <div>
                <p className="text-xs text-zinc-600">Applied</p>
                <p className="text-xs text-zinc-500 mt-0.5">{formatDate(job.applied_at)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-red-400">Delete this job?</p>
              <button
                onClick={handleDelete}
                className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}

          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(false); setForm({ ...job }); }}
                className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Check size={13} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
