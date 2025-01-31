import type { Appointment } from "@prisma/client";
import { google } from "googleapis";

export type GoogleAppointment = Pick<
  Appointment,
  "date" | "timeFrom" | "timeTo" | "confirmed"
>;

export const googleCalendarIdList = [
  process.env.GOOGLE_CALENDAR_ROOM_1_ID,
  process.env.GOOGLE_CALENDAR_ROOM_2_ID,
  process.env.GOOGLE_CALENDAR_ROOM_3_ID,
];

const beginString = "-----BEGIN PRIVATE KEY-----";
const endString = "-----END PRIVATE KEY-----";
const resultKey = [
  beginString,
  decodeURI(process.env.GOOGLE_SERVICE_PRIVATE_KEY as string),
  endString,
  "",
].join("\n");

const calendarScopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

// API key credentials
// export const calendar = google.calendar({
//   version: "v3",
//   auth: process.env.GOOGLE_API_KEY,
// });

// Service account credentials
export const calendarAPI = google.calendar("v3");
export const googleAuth = new google.auth.GoogleAuth({
  // keyFile: "./escp90-service-e59744a14000.json",
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: resultKey, // process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  },
  scopes: [...calendarScopes],
});
