import { useState } from "react";
import { X } from "lucide-react";
import { STATUS_CONFIG } from "../utils/constants";

const INITIAL = {
  company: "",
  role: "",
  status: "Bookmarked",
  location: "",
  salary: "",
  url: "",
  notes: "",
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
      {label} {required && <span className="text-violet-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors";

export default function AddJobModal({ onClose, onSave }) {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = "Required";
    if (!form.role.trim()) errs.role = "Required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-zinc-100">Add New Job</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company" required>
              <input
                className={`${inputClass} ${errors.company ? "border-red-500" : ""}`}
                placeholder="e.g. Stripe"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
              {errors.company && (
                <p className="text-xs text-red-400 mt-1">{errors.company}</p>
              )}
            </Field>

            <Field label="Role" required>
              <input
                className={`${inputClass} ${errors.role ? "border-red-500" : ""}`}
                placeholder="e.g. Frontend Engineer"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
              {errors.role && (
                <p className="text-xs text-red-400 mt-1">{errors.role}</p>
              )}
            </Field>
          </div>

          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input
                className={inputClass}
                placeholder="e.g. Remote"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>

            <Field label="Salary">
              <input
                className={inputClass}
                placeholder="e.g. ₹4 LPA–₹15LPA"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Job URL">
            <input
              className={inputClass}
              placeholder="https://..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
            />
          </Field>

          <Field label="Notes">
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Any notes about this role..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </form>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? "Saving..." : "Add Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
