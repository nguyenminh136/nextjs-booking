import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookingsList from "@/components/booking/booking-list";

export default function BookingsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link href="/bookings/new">
          <Button>Create Booking</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BookingsList />
      </div>
    </div>
  );
}
