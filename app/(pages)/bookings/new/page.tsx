"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateBookingInput } from "@/bookings/booking-schema";

export default function NewBookingPage() {
  const [form, setForm] = useState<CreateBookingInput>({
    studioId: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsCreated(false);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const responseData: unknown = await response.json().catch(() => null);
        const errorMessage =
          typeof responseData === "object" &&
          responseData !== null &&
          "error" in responseData &&
          typeof responseData.error === "string"
            ? responseData.error
            : "Failed to create booking";
        setError(errorMessage);
        return;
      }

      setIsCreated(true);
    } catch {
      setError("Booking service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-md">
      <h1 className="mb-4 text-xl font-semibold">Create a new booking</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          aria-label="Studio ID"
          placeholder="Studio ID"
          required
          value={form.studioId}
          onChange={event => setForm({ ...form, studioId: event.target.value })}
        />
        <Input
          aria-label="Booking date"
          type="date"
          required
          value={form.date}
          onChange={event => setForm({ ...form, date: event.target.value })}
        />
        <Input
          aria-label="Start time"
          type="time"
          required
          value={form.startTime}
          onChange={event => setForm({ ...form, startTime: event.target.value })}
        />
        <Input
          aria-label="End time"
          type="time"
          required
          value={form.endTime}
          onChange={event => setForm({ ...form, endTime: event.target.value })}
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {isCreated && (
          <p role="status" className="text-sm text-green-700">
            Booking created.
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating booking..." : "Create booking"}
        </Button>
      </form>
    </div>
  );
}
