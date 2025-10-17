import { Studio } from "./Studio";
import { User } from "./User";

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  note?: string;
  user: User;
  studio: Studio;
  status: "pending" | "confirmed" | "canceled";
}
