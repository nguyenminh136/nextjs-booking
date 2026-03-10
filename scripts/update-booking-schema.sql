-- Migration: Add new booking fields for enhanced booking system
-- Date: 2026-03-10
-- Description: Add purpose, attendees_count, payment_method fields and update status enum

-- Step 1: Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS purpose VARCHAR(255),
ADD COLUMN IF NOT EXISTS attendees_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'pay_on_site',
ADD COLUMN IF NOT EXISTS confirmation_token VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Update existing status values to new format
-- Map old 'pending' to 'pending_payment' or 'confirmed' based on context
-- For now, keep existing confirmed/canceled as is, only change pending entries
UPDATE bookings 
SET status = 'confirmed' 
WHERE status = 'pending';

-- Step 3: Create index on studio_id, date, start_time for atomic locking
-- First, we need to extract the date from startTime
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_date DATE;

UPDATE bookings 
SET booking_date = DATE(start_time);

-- Create index for faster conflict detection
CREATE INDEX IF NOT EXISTS idx_bookings_slot_lock ON bookings (studio_id, booking_date, start_time)
WHERE status IN ('confirmed', 'pending_payment');

-- Step 4: Add check constraint for valid payment methods
ALTER TABLE bookings 
ADD CONSTRAINT check_payment_method 
CHECK (payment_method IN ('online', 'pay_on_site'));

-- Step 5: Add check constraint for valid statuses
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS check_booking_status;
ALTER TABLE bookings 
ADD CONSTRAINT check_booking_status 
CHECK (status IN ('pending_payment', 'confirmed', 'canceled'));

-- Step 6: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create a function for atomic booking validation
CREATE OR REPLACE FUNCTION validate_and_reserve_booking(
    p_studio_id UUID,
    p_start_time TIMESTAMP,
    p_end_time TIMESTAMP
)
RETURNS TABLE (
    valid BOOLEAN,
    message TEXT,
    conflict_count INTEGER
) AS $$
DECLARE
    v_conflict_count INTEGER;
BEGIN
    -- Lock the relevant time slots
    SELECT COUNT(*) INTO v_conflict_count
    FROM bookings
    WHERE studio_id = p_studio_id
        AND status IN ('confirmed', 'pending_payment')
        AND (
            (start_time < p_end_time AND end_time > p_start_time)
        )
    FOR UPDATE;

    IF v_conflict_count > 0 THEN
        RETURN QUERY SELECT false, 'Time slot conflicts with existing booking', v_conflict_count;
    ELSE
        RETURN QUERY SELECT true, 'Slot is available', 0;
    END IF;
END;
$$ LANGUAGE plpgsql;
