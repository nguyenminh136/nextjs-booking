"use client";
import { useQuery } from "@tanstack/react-query";
import BookingCard from "@/components/booking/booking-card";
import { Booking } from "@/interface/Booking";
import { BookingCardListSkeleton } from "../skeletons/booking-card-list.skeleton";

export default function BookingsList() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  });

  if (isError) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  if (isLoading) {
    return <BookingCardListSkeleton />;
  }

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
