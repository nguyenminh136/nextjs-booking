import { createBookingSchema } from "@/bookings/booking-schema";
import { getServerAccessToken } from "@/lib/auth/get-server-access-token";
import { addBooking } from "@/services/booking.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth-option";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!(await getServerAccessToken())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "An email address is required to create a booking" },
        { status: 422 }
      );
    }

    let requestData: unknown;
    try {
      requestData = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const bookingInput = createBookingSchema.safeParse(requestData);
    if (!bookingInput.success) {
      return NextResponse.json(
        {
          error: "Invalid booking details",
          details: bookingInput.error.flatten()
        },
        { status: 400 }
      );
    }

    const result = await addBooking(bookingInput.data, userEmail);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    if (result.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error: unknown) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
