import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { NextRequest, NextResponse } from "next/server";

// In-memory lock for preventing race conditions
// In production, this would use a database transaction or distributed lock
const BOOKING_LOCKS = new Map<string, number>();
const LOCK_TIMEOUT = 5000; // 5 seconds

interface BookingValidationRequest {
  studioId: string;
  date: string;
  startTime: string;
  endTime?: string;
}

interface BookingValidationResponse {
  valid: boolean;
  message: string;
  lockId?: string;
}

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "booking-1",
    studioId: "studio-1",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "11:00",
  },
  {
    id: "booking-2",
    studioId: "studio-1",
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "16:00",
  },
];

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function isTimeConflict(
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string
): boolean {
  const existingStartMin = timeToMinutes(existingStart);
  const existingEndMin = timeToMinutes(existingEnd);
  const newStartMin = timeToMinutes(newStart);
  const newEndMin = timeToMinutes(newEnd);

  // Check if new slot overlaps with existing booking
  return newStartMin < existingEndMin && newEndMin > existingStartMin;
}

export async function POST(request: NextRequest): Promise<NextResponse<BookingValidationResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { valid: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: BookingValidationRequest = await request.json();
    const { studioId, date, startTime, endTime } = body;

    // Validate input
    if (!studioId || !date || !startTime) {
      return NextResponse.json(
        { valid: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate end time if not provided (default to 1 hour)
    const actualEndTime = endTime || addHours(startTime, 1);

    // Create a unique lock key for this booking
    const lockKey = `${studioId}-${date}`;

    // Check if there's an existing lock and if it's expired
    const existingLock = BOOKING_LOCKS.get(lockKey);
    if (existingLock && existingLock > Date.now()) {
      return NextResponse.json(
        { valid: false, message: "Booking slot temporarily reserved. Please try again." },
        { status: 409 }
      );
    }

    // Acquire lock
    const lockId = `lock-${Date.now()}-${Math.random()}`;
    const lockExpiry = Date.now() + LOCK_TIMEOUT;
    BOOKING_LOCKS.set(lockKey, lockExpiry);

    // Check for conflicts with existing bookings
    const conflictingBookings = MOCK_BOOKINGS.filter((booking) => {
      if (booking.studioId !== studioId || booking.date !== date) {
        return false;
      }
      return isTimeConflict(booking.startTime, booking.endTime, startTime, actualEndTime);
    });

    if (conflictingBookings.length > 0) {
      // Clear lock on conflict
      BOOKING_LOCKS.delete(lockKey);

      return NextResponse.json(
        {
          valid: false,
          message: `Selected time slot conflicts with existing booking. ${conflictingBookings.length} booking(s) found.`,
        },
        { status: 409 }
      );
    }

    // Validation successful - return lock ID for the actual booking creation
    return NextResponse.json(
      {
        valid: true,
        message: "Slot is available and reserved",
        lockId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error validating booking:", error);
    return NextResponse.json(
      { valid: false, message: error.message || "Validation failed" },
      { status: 500 }
    );
  }
}

// Helper function to add hours to a time string
function addHours(timeStr: string, hours: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const newHours = (h + hours) % 24;
  return `${String(newHours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
