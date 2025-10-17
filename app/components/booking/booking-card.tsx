// components/booking/booking-card.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Booking } from "@/interface/Booking";
import { format } from "date-fns";

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={booking.user.avatarUrl} alt={booking.user.name} />
          <AvatarFallback>
            {booking.user.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-base font-semibold text-gray-800">
            {booking.studio.name}
          </h3>
          <p className="text-sm text-gray-500">
            Booked by {booking.user.name ?? "Unknown"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex flex-col text-sm text-gray-600 space-y-1">
          <span>
            <strong>Time:</strong> {format(new Date(booking.startTime), "dd MMM yyyy HH:mm")} –{" "}
            {format(new Date(booking.endTime), "HH:mm")}
          </span>
          <span>
            <strong>Status:</strong> {booking.status}
          </span>
          <span>
            <strong>Note:</strong> {booking.note}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
