import { getBookings } from "@/services/booking.service";
import { NextResponse } from "next/server";

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
