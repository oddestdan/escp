import { prisma } from "~/db.server";
import { fromISOToRFC3339, fromRFC3339ToISO } from "~/utils/date";
import {
  getAppointmentDescription,
  getAppointmentTitle,
} from "~/routes/booking/admin";
import { calendar, CAL_ID, googleAuth } from "./googleApi.lib";
import { google } from "googleapis";

import type { Appointment } from "@prisma/client";
import type { GoogleAppointment } from "./googleApi.lib";
import { KYIV_TIME_ZONE } from "~/utils/constants";

export type { Appointment } from "@prisma/client";

export async function getAppointments(): Promise<GoogleAppointment[]> {
  // const prismaAppointments = await prisma.appointment.findMany();
  console.log("> Getting appointments from Google Calendar API...");

  // TODO: remove this logging in production
  if (Boolean("log-env") === false) {
    const {
      DATABASE_URL,
      SESSION_SECRET,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      GOOGLE_API_KEY,
      GOOGLE_SERVICE_EMAIL,
      GOOGLE_CALENDAR_ID,
      GOOGLE_SERVICE_PRIVATE_KEY,
    } = process.env;

    console.log({
      DATABASE_URL,
      SESSION_SECRET,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      GOOGLE_API_KEY,
      GOOGLE_SERVICE_EMAIL,
      GOOGLE_CALENDAR_ID,
      GOOGLE_SERVICE_PRIVATE_KEY,
    });
  }

  const authClient = await googleAuth.getClient();
  google.options({ auth: authClient });

  const events = await calendar.events.list({
    calendarId: CAL_ID,
    timeMin: new Date().toISOString(),
    timeZone: KYIV_TIME_ZONE,
  });
  const googleAppointments = events.data.items || [];

  const mappedGoogleAppointments: GoogleAppointment[] = googleAppointments
    .map((gApp) => {
      return {
        date: gApp.start?.date || gApp.start?.dateTime?.split("T")[0] || "",
        timeFrom: gApp.start ? fromRFC3339ToISO(gApp.start.dateTime || "") : "",
        timeTo: gApp.end ? fromRFC3339ToISO(gApp.end.dateTime || "") : "",
        confirmed: true,
      };
    })
    .filter((gApp) => gApp.date >= new Date().toISOString().split("T")[0]);

  console.log({
    mappedGoogleAppointments: mappedGoogleAppointments.slice(0, 10),
  });
  return mappedGoogleAppointments;
}

export async function getAppointmentById(
  id: string
): Promise<Appointment | null> {
  // TODO: replace with calendar.events.get({}) call
  // ??? Or not ???
  return prisma.appointment.findUnique({ where: { id } });
}

export async function createAppointment(
  appointment: Pick<
    Appointment,
    "date" | "timeFrom" | "timeTo" | "services" | "contactInfo" | "price"
  >
) {
  // GOOGLE CALENDAR
  console.log("> Creating an appointment into Google Calendar API...");
  // console.log({ appointment });
  const createEventDTO = {
    calendarId: CAL_ID,
    requestBody: {
      summary: getAppointmentTitle(
        JSON.parse(appointment.contactInfo),
        new Date(appointment.timeFrom),
        new Date(appointment.timeTo)
      ),
      description: getAppointmentDescription(
        JSON.parse(appointment.services),
        JSON.parse(appointment.contactInfo)
      ),
      start: {
        dateTime: fromISOToRFC3339(appointment.timeFrom),
        timeZone: KYIV_TIME_ZONE,
      },
      end: {
        dateTime: fromISOToRFC3339(appointment.timeTo),
        timeZone: KYIV_TIME_ZONE,
      },
    },
  };
  // console.log({ createEventDTO, start: createEventDTO.requestBody.start });
  const createdEvent = await calendar.events.insert(createEventDTO);
  console.log({ createdEvent: createdEvent.data });

  // PRISMA

  // // check for already existing prisma appointment for that datetime
  // const appointments = await prisma.appointment.findMany({
  //   where: {
  //     date: appointment.date,
  //   },
  // });
  // const isAppointmentTaken = appointments
  //   .map(({ timeFrom, timeTo }) => [timeFrom, timeTo])
  //   .some(
  //     ([from, to]) =>
  //       (appointment.timeFrom >= from && appointment.timeFrom < to) ||
  //       (appointment.timeTo > from && appointment.timeTo <= to)
  //   );

  // if (isAppointmentTaken) {
  //   console.log("Appointment already taken");
  //   return null;
  // }

  return prisma.appointment.create({ data: appointment });
}

export async function updateAppointment(
  appointment: Pick<Appointment, "date" | "timeFrom" | "timeTo" | "id">
) {
  // TODO: replace with calendar.events.update or .patch({}) call
  return prisma.appointment.update({
    where: { id: appointment.id },
    data: appointment,
  });
}

export async function deleteAppointment(appointmentId: string) {
  // GOOGLE CALENDAR
  // const res = await calendar.events.delete({
  //   calendarId: CAL_ID,
  //   eventId: appointmentId || "",
  // });
  // console.log(`deleted item ${appointmentId}`);
  // console.log(res);

  // PRISMA
  return prisma.appointment.delete({ where: { id: appointmentId } });
}

export async function confirmAppointment(
  appointmentId: string,
  confirmed = true
) {
  // TODO: replace with calendar.events.update or .patch({}) call
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { confirmed: confirmed },
  });
}
