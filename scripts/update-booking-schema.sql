-- Migration: Add new booking fields for enhanced booking system
-- Date: 2026-03-10
-- Description: Add purpose, attendees_count, payment_method fields and update status enum

-- Step 1: Add new columns to bookings table
ALTER TABLE "public"."bookings" 
ADD COLUMN IF NOT EXISTS "purpose" TEXT,
ADD COLUMN IF NOT EXISTS "attendees_count" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "payment_method" TEXT DEFAULT 'pay_on_site',
ADD COLUMN IF NOT EXISTS "confirmation_token" TEXT,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Update existing status values to new format
UPDATE "public"."bookings" 
SET "status" = 'confirmed' 
WHERE "status" = 'pending';

-- Step 3: Create index on studio_id, start_time for conflict detection
CREATE INDEX IF NOT EXISTS "idx_bookings_slot_lock" 
ON "public"."bookings" ("studio_id", "start_time", "end_time")
WHERE "status" IN ('confirmed', 'pending_payment');

-- Step 4: Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger for updating the updated_at column
DROP TRIGGER IF EXISTS "update_bookings_updated_at" ON "public"."bookings";
CREATE TRIGGER "update_bookings_updated_at" 
BEFORE UPDATE ON "public"."bookings"
FOR EACH ROW 
EXECUTE FUNCTION "public"."update_updated_at_column"();
