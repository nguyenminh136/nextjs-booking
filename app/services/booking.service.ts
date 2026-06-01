import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { Booking } from "@/interface/Booking";

const getBookings = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return { error: "Unauthorized missing token", status: 401 };
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return { error: error.message || "Failed to fetch", status: 500 };
  }
};

const addBooking = async (bookingData: Booking) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return { error: "Unauthorized missing token", status: 401 };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error adding booking:", error);
    return { error: error.message || "Failed to add booking", status: 500 };
  }
};

export { getBookings, addBooking };
