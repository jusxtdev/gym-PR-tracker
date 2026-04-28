-- This is an empty migration.
-- 1. Drop existing column
ALTER TABLE "PR"
DROP COLUMN "PR";

-- 2. Recreate as generated column
ALTER TABLE "PR"
ADD COLUMN "PR" DOUBLE PRECISION
GENERATED ALWAYS AS ("weight" * "reps") STORED;