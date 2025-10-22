import BookingCard from "@/components/booking/booking-card";
import { getBookings } from "@/services/booking.service";
import { Booking } from "@/interface/Booking";

export default async function BookingsList() {
  const bookings = await getBookings();

  return (
    <>
      {bookings.length > 0 ? (
        bookings.map((b: Booking) => <BookingCard key={b.id} booking={b} />)
      ) : (
        <div>No bookings found</div>
      )}
    </>
  );
}
