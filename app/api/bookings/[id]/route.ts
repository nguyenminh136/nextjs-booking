import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch booking from external API
    const response = await fetch(`${process.env.API_URL}/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
