"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilityResponse {
  date: string;
  studioId: string;
  granularity: "30m" | "1h";
  slots: TimeSlot[];
  bookedCount: number;
  availableCount: number;
}

interface StudioAvailabilityProps {
  studioId: string;
}

export default function StudioAvailability({ studioId }: StudioAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<"30m" | "1h">("1h");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch availability when date or granularity changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const params = new URLSearchParams();
        params.append("date", dateStr);
        params.append("granularity", granularity);

        const response = await fetch(
          `/api/studios/${studioId}/availability?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        setAvailability(data);
        setSelectedSlot(null);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, studioId, granularity]);

  const handlePreviousDay = () => {
    const newDate = addDays(selectedDate, -1);
    if (newDate >= startOfDay(new Date())) {
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    try {
      setIsBooking(true);
      setBookingError(null);

      // Calculate end time (1 hour by default for 1h granularity, 30 min for 30m)
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      const durationMinutes = granularity === "1h" ? 60 : 30;
      const endMinutes = minutes + durationMinutes;
      const endHours = hours + Math.floor(endMinutes / 60);
      const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

      // Validate slot availability before redirecting
      const response = await fetch("/api/bookings/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId,
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime: selectedSlot,
          endTime,
        }),
      });

      const validationResult = await response.json();

      if (!validationResult.valid) {
        setBookingError(validationResult.message);
        // Refresh availability to show updated bookings
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const params = new URLSearchParams();
        params.append("date", dateStr);
        params.append("granularity", granularity);
        const refreshResponse = await fetch(
          `/api/studios/${studioId}/availability?${params.toString()}`
        );
        const refreshData = await refreshResponse.json();
        setAvailability(refreshData);
        return;
      }

      // Redirect to booking form with selected slot details
      const bookingDate = format(selectedDate, "yyyy-MM-dd");
      const slotStart = `${bookingDate}T${selectedSlot}:00`;
      const slotEnd = `${bookingDate}T${endTime}:00`;
      
      // Use window.location for client-side navigation that persists state
      window.location.href = `/bookings/new?studioId=${studioId}&startTime=${encodeURIComponent(slotStart)}&endTime=${encodeURIComponent(slotEnd)}`;
    } catch (error) {
      console.error("Error booking slot:", error);
      setBookingError("Failed to book slot. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const dateStr = format(selectedDate, "MMM d, yyyy");
  const dayOfWeek = format(selectedDate, "EEEE");
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Card className="sticky top-6 p-6 space-y-4">
      {/* Date Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Book a Slot</h3>
          <Calendar className="h-5 w-5 text-gray-600" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={handlePreviousDay}
              variant="ghost"
              size="icon"
              disabled={selectedDate <= startOfDay(new Date())}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm font-medium text-gray-600">{dayOfWeek}</p>
              <p className="text-lg font-bold text-gray-900">{dateStr}</p>
              {isToday && (
                <Badge variant="secondary" className="mt-1">
                  Today
                </Badge>
              )}
            </div>

            <Button
              onClick={handleNextDay}
              variant="ghost"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Granularity Toggle */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Time Slot Duration</p>
        <div className="flex gap-2">
          <Button
            onClick={() => setGranularity("1h")}
            variant={granularity === "1h" ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            1 Hour
          </Button>
          <Button
            onClick={() => setGranularity("30m")}
            variant={granularity === "30m" ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            30 Min
          </Button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">Available Times</p>
          {availability && (
            <span className="text-xs text-gray-500">
              {availability.availableCount} available
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            // Loading skeletons
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : availability && availability.slots.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {availability.slots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedSlot(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    slot.available
                      ? selectedSlot === slot.time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No slots available</p>
          )}
        </div>
      </div>

      {/* Booking Error */}
      {bookingError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{bookingError}</p>
        </div>
      )}

      {/* Booking Summary */}
      {selectedSlot && (
        <div className="space-y-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-gray-600">Selected Time</p>
          <p className="font-bold text-gray-900">
            {format(selectedDate, "MMM d, yyyy")} at {selectedSlot}
          </p>
        </div>
      )}

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        disabled={!selectedSlot || isLoading || isBooking}
        className="w-full"
        size="lg"
      >
        {isLoading || isBooking ? "Processing..." : "Continue to Booking Details"}
      </Button>

      {/* Note */}
      <p className="text-xs text-gray-500 text-center">
        Confirmation required via email
      </p>
    </Card>
  );
}
