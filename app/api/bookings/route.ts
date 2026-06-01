import { addBooking } from "@/services/booking.service";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth-option";
import { getServerSession } from "next-auth";

export async function POST( request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestData = await request.json();
    const data = await addBooking(requestData);
    if (data && !data.error) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: data?.error || "Failed to create booking" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
