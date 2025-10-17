"use client";

import { useSession } from "next-auth/react";
import BookingCard from "@/components/booking/booking-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Booking } from "@/interface/Booking";

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        const res = await fetch("/api/booking", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`
          },
          cache: "no-store"
        });

        if (!res.ok) {
          console.error("Fetch failed:", res.status, await res.text());
          return;
        }

        const data = await res.json();
        setBookings(data);
      };

      fetchData();
    }
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please login first.</p>;

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
