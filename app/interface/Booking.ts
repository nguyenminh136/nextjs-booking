import { Studio } from "./Studio";
import { User } from "./User";

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  note?: string;
  purpose?: string;
  attendeesCount?: number;
  paymentMethod?: "online" | "pay_on_site";
  user: User;
  studio: Studio;
  status: "pending_payment" | "confirmed" | "canceled";
  confirmationToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
