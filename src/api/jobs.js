// ─────────────────────────────────────────────────────────────────────────────
// API Layer — jobs.js
//
// HOW TO CONNECT TO YOUR POSTGRES BACKEND:
//   1. Replace BASE_URL with your Express/Fastify server URL
//      e.g. const BASE_URL = "http://localhost:4000/api";
//   2. Make sure your server has CORS enabled for your React dev origin
//   3. Set up your .env:  VITE_API_URL=http://localhost:4000/api
//      Then use: const BASE_URL = import.meta.env.VITE_API_URL;
//
// EXPECTED POSTGRES TABLE (see /server/schema.sql for the full schema):
//   CREATE TABLE jobs (
//     id          SERIAL PRIMARY KEY,
//     company     TEXT NOT NULL,
//     role        TEXT NOT NULL,
//     status      TEXT DEFAULT 'Bookmarked',
//     location    TEXT,
//     salary      TEXT,
//     url         TEXT,
//     notes       TEXT,
//     applied_at  TIMESTAMPTZ,
//     created_at  TIMESTAMPTZ DEFAULT NOW(),
//     updated_at  TIMESTAMPTZ DEFAULT NOW()
//   );
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || null;

// ── Local storage fallback (used when VITE_API_URL is not set) ────────────────
const LS_KEY = "jobtracker_jobs";

const localStore = {
  getAll: () => {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : getSeedData();
  },
  save: (jobs) => localStorage.setItem(LS_KEY, JSON.stringify(jobs)),
};

function getSeedData() {
  return [];
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────
async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── API object (switches between real API and localStorage) ───────────────────
export const jobsApi = {
  getAll: async () => {
    if (!BASE_URL) return localStore.getAll();
    return http("/jobs");
  },

  create: async (data) => {
    if (!BASE_URL) {
      const jobs = localStore.getAll();
      const newJob = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        applied_at: data.status !== "Bookmarked" ? new Date().toISOString() : null,
      };
      localStore.save([newJob, ...jobs]);
      return newJob;
    }
    return http("/jobs", { method: "POST", body: JSON.stringify(data) });
  },

  update: async (id, data) => {
    if (!BASE_URL) {
      const jobs = localStore.getAll();
      const updated = { ...jobs.find((j) => j.id === id), ...data, updated_at: new Date().toISOString() };
      localStore.save(jobs.map((j) => (j.id === id ? updated : j)));
      return updated;
    }
    return http(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  delete: async (id) => {
    if (!BASE_URL) {
      const jobs = localStore.getAll();
      localStore.save(jobs.filter((j) => j.id !== id));
      return null;
    }
    return http(`/jobs/${id}`, { method: "DELETE" });
  },
};
