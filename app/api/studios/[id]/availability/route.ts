import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { NextRequest, NextResponse } from "next/server";

// Mock bookings data - in production, this would come from database
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
  {
    id: "booking-3",
    studioId: "studio-1",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:30",
  },
];

// Helper function to generate available time slots
function generateAvailableSlots(
  date: string,
  studioId: string,
  granularity: "30m" | "1h" = "1h"
) {
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 20; // 8 PM

  // Get bookings for this date
  const dateBookings = MOCK_BOOKINGS.filter(
    (b) => b.studioId === studioId && b.date === date
  );

  // Helper function to check if time slot is booked
  const isBooked = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const checkTime = hours * 60 + minutes;

    return dateBookings.some((booking) => {
      const [startH, startM] = booking.startTime.split(":").map(Number);
      const [endH, endM] = booking.endTime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      return checkTime >= startMinutes && checkTime < endMinutes;
    });
  };

  const increment = granularity === "30m" ? 30 : 60;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += increment) {
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push({
        time: timeStr,
        available: !isBooked(timeStr),
      });
    }
  }

  return slots;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const granularity = (searchParams.get("granularity") as "30m" | "1h") || "1h";
    const { id: studioId } = await params;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    // Generate available slots for the date
    const slots = generateAvailableSlots(date, studioId, granularity);

    return NextResponse.json({
      date,
      studioId,
      granularity,
      slots,
      bookedCount: slots.filter((s) => !s.available).length,
      availableCount: slots.filter((s) => s.available).length,
    });
  } catch (error: any) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
