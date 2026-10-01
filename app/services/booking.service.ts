import type { CreateBookingInput } from "@/bookings/booking-schema";
import { getServerAccessToken } from "@/lib/auth/get-server-access-token";

const getBookings = async () => {
  try {
    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      return { error: "Unauthorized missing token", status: 401 };
    }
    const res = await fetch(`${process.env.API_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return { error: error.message || "Failed to fetch", status: 500 };
  }
};

type AddBookingResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string };

function getErrorMessage(data: unknown): string | null {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return null;
}

const addBooking = async (
  bookingData: CreateBookingInput,
  userEmail: string
): Promise<AddBookingResult> => {
  try {
    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      return { ok: false, error: "Unauthorized", status: 401 };
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      console.error("Booking API URL is not configured");
      return { ok: false, error: "Booking service is unavailable", status: 500 };
    }

    const res = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...bookingData,
        status: "pending",
        userEmail
      })
    });

    let data: unknown = null;
    if (res.status !== 204) {
      const responseText = await res.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText) as unknown;
        } catch {
          data = responseText;
        }
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        error: getErrorMessage(data) ?? "Failed to create booking",
        status: res.status
      };
    }

    return { ok: true, data, status: res.status };
  } catch (error: unknown) {
    console.error("Error adding booking:", error);
    return { ok: false, error: "Booking service is unavailable", status: 502 };
  }
};

export { getBookings, addBooking };
