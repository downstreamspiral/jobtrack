-- ─────────────────────────────────────────────────────────────────────────────
-- server/schema.sql  — Run this once to create the jobs table
--
-- Usage:
--   psql -U <user> -d <database> -f schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id          SERIAL PRIMARY KEY,
  company     TEXT        NOT NULL,
  role        TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'Bookmarked'
                          CHECK (status IN (
                            'Bookmarked',
                            'Applied',
                            'Interviewing',
                            'Take-home / Assessment',
                            'Offer',
                            'Rejected',
                            'Ghosted',
                            'Withdrawn'
                          )),
  location    TEXT,
  salary      TEXT,
  url         TEXT,
  notes       TEXT,
  applied_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON jobs;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Optional index for status filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
