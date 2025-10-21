import React from "react";
import Link from "next/link";
import BookingCard from "@/components/booking/booking-card";
import { Button } from "@/components/ui/button";
import { getBookings } from "@/services/booking.service";
import { Booking } from "@/interface/Booking";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link href="/bookings/new">
          <Button>Create Booking</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.length > 0 ? (
          bookings.map((b: Booking) => <BookingCard key={b.id} booking={b} />)
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}
