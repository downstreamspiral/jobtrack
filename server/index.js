// ─────────────────────────────────────────────────────────────────────────────
// server/index.js  —  Express + PostgreSQL backend for JobTrack
// ─────────────────────────────────────────────────────────────────────────────
// Setup:
//   cd server
//   npm install
//   cp .env.example .env   (fill in your DB credentials)
//   node index.js
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 4000;

// ── Postgres connection pool ──────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // OR use individual fields:
  // host:     process.env.DB_HOST     || "localhost",
  // port:     process.env.DB_PORT     || 5432,
  // database: process.env.DB_NAME     || "jobtracker",
  // user:     process.env.DB_USER     || "postgres",
  // password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => console.error("Postgres pool error:", err));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM jobs WHERE id = $1", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST /api/jobs
app.post("/api/jobs", async (req, res) => {
  const { company, role, status, location, salary, url, notes } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: "company and role are required" });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO jobs (company, role, status, location, salary, url, notes, applied_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        company,
        role,
        status || "Bookmarked",
        location || null,
        salary || null,
        url || null,
        notes || null,
        status && status !== "Bookmarked" ? new Date() : null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// PATCH /api/jobs/:id
app.patch("/api/jobs/:id", async (req, res) => {
  const allowed = ["company", "role", "status", "location", "salary", "url", "notes", "applied_at"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  // Auto-set applied_at when status moves away from Bookmarked
  if (updates.status && updates.status !== "Bookmarked" && !updates.applied_at) {
    const existing = await pool.query("SELECT applied_at FROM jobs WHERE id = $1", [req.params.id]);
    if (existing.rows[0] && !existing.rows[0].applied_at) {
      updates.applied_at = new Date();
    }
  }

  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

  try {
    const { rows } = await pool.query(
      `UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM jobs WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`✅  JobTrack API running on http://localhost:${PORT}`));
