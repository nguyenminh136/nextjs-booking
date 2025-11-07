import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";

const getBookings = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return { error: "Unauthorized missing token", status: 401 };
  }

  const res = await fetch(`${process.env.API_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  const data = await res.json();
  return data;
};
export { getBookings };
