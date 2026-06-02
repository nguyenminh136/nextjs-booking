import BookingCard from "@/components/booking/booking-card";
import { Booking } from "@/interface/Booking";
import { getBookings } from "@/services/booking.service";

export default async function BookingsList() {
  const data: Booking[] = await getBookings();
  return (
    <>
      {data && data.length > 0 ? (
        data.map((b: Booking) => <BookingCard key={b.id} booking={b} />)
      ) : (
        <div>No bookings found</div>
      )}
    </>
  );
}
