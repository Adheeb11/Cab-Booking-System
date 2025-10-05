-- Reset all cabs to available
UPDATE cabs
SET is_available = true;
-- Check current status
SELECT cab_id,
  cab_number,
  cab_type,
  is_available
FROM cabs
ORDER BY cab_id;