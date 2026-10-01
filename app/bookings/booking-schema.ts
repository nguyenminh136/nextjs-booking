import { z } from "zod";

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value;
}

export const createBookingSchema = z
  .object({
    studioId: z.string().trim().min(1).max(128),
    date: z.string().refine(isValidCalendarDate, "Date must be a valid YYYY-MM-DD date"),
    startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Start time must use HH:mm format"),
    endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "End time must use HH:mm format")
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: "End time must be later than start time",
    path: ["endTime"]
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
