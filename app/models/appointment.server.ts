import { prisma } from "~/db.server";
import {
  addDays,
  addMonths,
  fromISOToRFC3339,
  fromRFC3339ToISO,
} from "~/utils/date";
import {
  getAppointmentDescription,
  getAppointmentTitle,
} from "~/routes/booking/admin";
import { calendarAPI, googleAuth, googleCalendarIdList } from "./googleApi.lib";
import { google } from "googleapis";
import { KYIV_TIME_ZONE } from "~/utils/constants";
import { studioColorCodesMap, unverifiedColorCode } from "~/utils/studiosData";
import { runEmailNotifier, runSmsNotifier } from "./notifiers.lib";

import type { Appointment } from "@prisma/client";
import type { GoogleAppointment } from "./googleApi.lib";
import { IS_POST_CREATION_FLOW, type ContactInfo } from "~/store/bookingSlice";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import type { AppointmentDTO, CreateEventDTO } from "~/types/appointment.type";
export type { Appointment } from "@prisma/client";

const createAllDayEvent = (dateString: string) => {
  const xTime = fromRFC3339ToISO(dateString);
  const xDate = xTime.split("T")[0];
  const yTime = xDate.concat("T00:00:00.000Z");
  const zTime = xDate.concat("T24:00:00.000Z");
  return {
    date: xDate,
    timeFrom: yTime,
    timeTo: zTime,
    confirmed: true,
  };
};

export async function getAppointments(
  calendarIndex: number,
  dateString?: string
): Promise<GoogleAppointment[]> {
  // const prismaAppointments = await prisma.appointment.findMany();
  console.log("> Getting appointments from Google Calendar API...");

  if (Boolean("log-env") === false) {
    const {
      DATABASE_URL,
      SESSION_SECRET,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      GOOGLE_API_KEY,
      GOOGLE_SERVICE_EMAIL,
      GOOGLE_CALENDAR_ROOM_1_ID,
      GOOGLE_CALENDAR_ROOM_2_ID,
      GOOGLE_CALENDAR_ROOM_3_ID,
      GOOGLE_SERVICE_PRIVATE_KEY,
    } = process.env;

    console.log({
      DATABASE_URL,
      SESSION_SECRET,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      GOOGLE_API_KEY,
      GOOGLE_SERVICE_EMAIL,
      GOOGLE_CALENDAR_ROOM_1_ID,
      GOOGLE_CALENDAR_ROOM_2_ID,
      GOOGLE_CALENDAR_ROOM_3_ID,
      GOOGLE_SERVICE_PRIVATE_KEY,
    });
  }

  const authClient = await googleAuth.getClient();
  google.options({ auth: authClient });

  const events = await calendarAPI.events.list({
    calendarId: googleCalendarIdList[calendarIndex],
    timeZone: KYIV_TIME_ZONE, //  Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeMin: new Date().toISOString(),
    timeMax: dateString
      ? addDays(new Date(dateString), 1).toISOString() // parametrized end date
      : addMonths(new Date(), 3).toISOString(), // 3 months worth of calendar bookings
  });
  const googleAppointments = events.data.items || [];

  const mappedGoogleAppointments: GoogleAppointment[] = googleAppointments
    .map(({ start, end }) => {
      // all-day event
      if (start?.date) {
        return createAllDayEvent(start.date);
      }

      return {
        date: start?.date || start?.dateTime?.split("T")[0] || "",
        timeFrom: start ? fromRFC3339ToISO(start.dateTime || "") : "",
        timeTo: end ? fromRFC3339ToISO(end.dateTime || "") : "",
        confirmed: true,
      };
    })
    .filter((gApp) => gApp.date >= new Date().toISOString().split("T")[0]);

  return mappedGoogleAppointments;
}

export async function getAppointmentById(eventId: string, calendarIndex = 0) {
  console.log(
    `> Getting an appointment id=${eventId} from Google Calendar API...`
  );

  const authClient = await googleAuth.getClient();
  google.options({ auth: authClient });

  const calendarAppointment = await calendarAPI.events.get({
    calendarId: googleCalendarIdList[calendarIndex],
    eventId,
  });

  console.log({ calendarAppointment });
  return calendarAppointment;
}

export async function getPrismaAppointments(
  studioId: number
): Promise<Appointment[]> {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(`> Getting all appointments from Prisma...`);

  return prisma.appointment.findMany({
    where: {
      studioId,
      OR: [
        { expiresAt: null }, // Include appointments where expiresAt is null
        { expiresAt: { gt: new Date() } }, // Include appointments where expiresAt is in the future
      ],
    },
  });
}

export async function getPrismaAppointmentsByDate(
  studioId: number,
  date: string
): Promise<Appointment[]> {
  console.log("**************************************");
  console.log(`> Getting all appointments from Prisma for date ${date}...`);

  return prisma.appointment.findMany({
    where: {
      date,
      studioId,
      OR: [
        { expiresAt: null }, // Include appointments where expiresAt is null
        { expiresAt: { gt: new Date() } }, // Include appointments where expiresAt is in the future
      ],
    },
  });
}

export async function getPrismaAppointmentById(id: string) {
  console.log(`> Getting an appointment id=${id} from Prisma...`);
  return prisma.appointment.findUnique({ where: { id } });

  let appointment: Appointment | null = null;
  // Array.from(Array(3).keys()).map(async (idx) => {
  //   if (appointment?.id) return;

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

  // appointment = await prisma.appointment.findUnique({ where: { id } });

  // OPTION 2 -- Using findFirst instead of findUnique
  // to prevent Prisma caching issues
  appointment = await prisma.appointment.findUnique({ where: { id } });
  // appointment = (
  //   await prisma.$transaction([
  //     prisma.appointment.findFirst({ where: { id } }),
  //   ])
  // )[0];
  // });

  return appointment;
}

export async function createAppointment(
  appointment: AppointmentDTO,
  calendarIndex: number,
  isUnverified = false
) {
  console.log("> Creating an appointment into Google Calendar API...");
  console.log({ appointment });

  const studioInfo: StudioInfo = JSON.parse(appointment.studio);
  const contactInfo: ContactInfo = JSON.parse(appointment.contactInfo);
  const dateFrom = new Date(appointment.timeFrom);
  const dateTo = new Date(appointment.timeTo);
  const createEventDTO: CreateEventDTO = {
    calendarId: googleCalendarIdList[calendarIndex],
    requestBody: {
      summary: getAppointmentTitle(
        studioInfo,
        contactInfo,
        dateFrom,
        dateTo,
        appointment.price
      ),
      description: getAppointmentDescription(
        JSON.parse(appointment.services),
        contactInfo
      ),
      start: {
        dateTime: fromISOToRFC3339(appointment.timeFrom),
        timeZone: KYIV_TIME_ZONE,
      },
      end: {
        dateTime: fromISOToRFC3339(appointment.timeTo),
        timeZone: KYIV_TIME_ZONE,
      },
      // for later parsing on confirmation screen
      extendedProperties: {
        private: {
          contactInfo: appointment.contactInfo,
          services: appointment.services,
          price: appointment.price,
          studio: appointment.studio,
        },
      },
      // https://lukeboyle.com/blog/posts/google-calendar-api-color-id
      // https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html#list-event-colors
      colorId: isUnverified
        ? unverifiedColorCode
        : studioColorCodesMap[calendarIndex],
    },
  };
  console.log("====================================");
  console.log(1);
  const createdEvent = await calendarAPI.events.insert(createEventDTO);
  console.log(2);
  console.log({ createdEvent: createdEvent.data });

  await runEmailNotifier(appointment, createEventDTO, createdEvent.data.id);
  console.log(3);
  if (IS_POST_CREATION_FLOW) {
    await runSmsNotifier(appointment, createdEvent.data.id);
    console.log(3.1);
  }

  console.log("------------------------------------");
  return createdEvent.data;
}

export async function createPrismaAppointment(
  appointment: Pick<
    Appointment,
    | "date"
    | "timeFrom"
    | "timeTo"
    | "services"
    | "contactInfo"
    | "price"
    | "studio"
    | "studioId"
  >
) {
  console.log("> Creating an appointment into Prisma...");
  console.log({ appointment });

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

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes from now

  const prismaAppointment = await prisma.appointment.create({
    data: { ...appointment, expiresAt },
  });
  console.log({ prismaAppointment });
  console.log(
    `Prisma Appointment ${prismaAppointment.id} will self destruct in 60 minutes`
  );

  return prismaAppointment;
}

export async function updateAppointment(
  appointment: Pick<Appointment, "date" | "timeFrom" | "timeTo" | "id">
) {
  // calendar.events.update or .patch({}) call

  // PRISMA

  return prisma.appointment.update({
    where: { id: appointment.id },
    data: appointment,
  });
}

export async function deleteAppointment(
  deleteAppointmentId: string,
  calendarIndex: number
) {
  await calendarAPI.events.delete({
    eventId: deleteAppointmentId,
    calendarId: googleCalendarIdList[calendarIndex],
  });

  console.log({
    deleteAppointmentId,
    calendarIndex,
  });
}

export async function deletePrismaAppointment(appointmentId: string) {
  console.log(`> Deleting an appointment id=${appointmentId} from Prisma...`);

  const foundPrismaId = await getPrismaAppointmentById(appointmentId);
  console.log(`>> No appointment found for id=${appointmentId}`);

  if (!foundPrismaId) return;

  try {
    return prisma.appointment.delete({ where: { id: appointmentId } });
  } catch (error) {
    console.error(error);
  }
}

export async function confirmAppointment(
  appointment: Appointment,
  appointmentId: string,
  calendarIndex: number
) {
  console.log("> Updating an appointment in Google Calendar API...");
  const updatedCalendarEvent = await calendarAPI.events.patch({
    eventId: appointmentId,
    calendarId: googleCalendarIdList[calendarIndex],
    requestBody: { colorId: studioColorCodesMap[calendarIndex] },
  });

  const confirmedAppointment = updatedCalendarEvent.data;
  console.log({
    confirmedAppointment,
    appointmentId,
    calendarIndex,
  });

  runSmsNotifier(appointment, confirmedAppointment.id);

  return confirmedAppointment;
}

export async function confirmPrismaAppointment(
  appointmentId: string,
  confirmed = true
) {
  // calendar.events.update or .patch({}) call
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { confirmed: confirmed },
  });
}
