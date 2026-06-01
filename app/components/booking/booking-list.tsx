import { Suspense } from "react";
import BookingCard from "@/components/booking/booking-card";
import { Booking } from "@/interface/Booking";
import { BookingCardListSkeleton } from "../skeletons/booking-card-list.skeleton";
import { getBookings } from "@/services/booking.service";

export default async function BookingsList() {
  const data: Booking[] = await getBookings();
  return (
    <Suspense fallback={<BookingCardListSkeleton />}>
      {data && data.length > 0 ? (
        data.map((b: Booking) => <BookingCard key={b.id} booking={b} />)
      ) : (
        <div>No bookings found</div>
      )}
    </Suspense>
  );
}
