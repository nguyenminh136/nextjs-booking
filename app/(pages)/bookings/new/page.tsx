"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function NewBookingPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    studioName: "",
    customerName: "",
    startTime: "",
    endTime: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(form)
    });

    alert("Booking created!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-semibold mb-4">Create a new booking</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Studio name"
          value={form.studioName}
          onChange={e => setForm({ ...form, studioName: e.target.value })}
        />
        <Input
          placeholder="Customer name"
          value={form.customerName}
          onChange={e => setForm({ ...form, customerName: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.startTime}
          onChange={e => setForm({ ...form, startTime: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.endTime}
          onChange={e => setForm({ ...form, endTime: e.target.value })}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
