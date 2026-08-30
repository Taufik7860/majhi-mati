-- =========================================================
-- PROJECT DATA INTEGRITY PROTECTION
-- =========================================================

-- Example: prevent invalid negative budgets
ALTER TABLE projects
ADD CONSTRAINT projects_budget_non_negative
CHECK (budget >= 0);

-- Example: prevent progress outside 0-100
ALTER TABLE projects
ADD CONSTRAINT projects_progress_valid
CHECK (progress >= 0 AND progress <= 100);