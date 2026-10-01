import assert from "node:assert/strict";
import test from "node:test";
import { createBookingSchema } from "./booking-schema";

const validBooking = {
  studioId: "studio-123",
  date: "2026-10-02",
  startTime: "09:00",
  endTime: "10:00"
};

test("accepts a valid booking request", () => {
  assert.equal(createBookingSchema.safeParse(validBooking).success, true);
});

test("rejects invalid dates and times", () => {
  assert.equal(
    createBookingSchema.safeParse({
      ...validBooking,
      date: "2026-02-30"
    }).success,
    false
  );
  assert.equal(
    createBookingSchema.safeParse({
      ...validBooking,
      startTime: "25:00"
    }).success,
    false
  );
});

test("rejects bookings whose end time is not later than start time", () => {
  assert.equal(
    createBookingSchema.safeParse({
      ...validBooking,
      endTime: "09:00"
    }).success,
    false
  );
});
