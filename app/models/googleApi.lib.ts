import type { Appointment } from "@prisma/client";
import { google } from "googleapis";

export type GoogleAppointment = Pick<
  Appointment,
  "date" | "timeFrom" | "timeTo" | "confirmed"
>;

export const CAL_ID = process.env.GOOGLE_CALENDAR_ID;

// API key credentials
// export const calendar = google.calendar({
//   version: "v3",
//   auth: process.env.GOOGLE_API_KEY,
// });

// Service account credentials
export const calendar = google.calendar("v3");
export const googleAuth = new google.auth.GoogleAuth({
  // keyFile: "./escp90-service-e59744a14000.json",
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  },
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ],
});
