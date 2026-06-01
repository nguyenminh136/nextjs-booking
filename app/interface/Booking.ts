import { Studio } from "./Studio";
import { User } from "./User";

export interface Booking {
  id?: string;
  startTime: string;
  endTime: string;
  note?: string;
  user: User;
  studio: Studio;
  userEmail: string;
  studioId: string;
  date: string;
  status: "pending" | "confirmed" | "canceled";
  createdAt: string;
  updatedAt?: string;
}
