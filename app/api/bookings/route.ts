import { getBookings, createBooking } from "@/services/booking.service";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { Booking } from "@/interface/Booking";

export async function GET() {
  try {
    const data = await getBookings();
    if (data && data.length) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "No bookings found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { startTime, endTime, purpose, attendeesCount, paymentMethod, note, studio, status } = body;

    // Validate required fields
    if (!startTime || !endTime || !purpose || !attendeesCount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['online', 'pay_on_site'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Validate status
    if (!['pending_payment', 'confirmed', 'canceled'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // Create booking payload with additional fields
    const bookingPayload: Partial<Booking> = {
      startTime,
      endTime,
      purpose,
      attendeesCount,
      paymentMethod,
      note,
      status,
      studio,
      user: session.user as any
    };

    // Call service to create booking
    const result = await createBooking(bookingPayload);

    if (result.error) {
      // Check if it's a double-booking error
      if (result.error.includes('conflict') || result.error.includes('already booked')) {
        return NextResponse.json(
          { error: "This time slot is no longer available" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
