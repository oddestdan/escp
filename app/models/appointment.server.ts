import { prisma } from "~/db.server";
import crypto from "crypto";
import { addMonths, fromISOToRFC3339, fromRFC3339ToISO } from "~/utils/date";
import {
  getAppointmentDescription,
  getAppointmentTitle,
} from "~/routes/booking/admin";
import { calendarAPI, CAL_ID, googleAuth } from "./googleApi.lib";
import { google } from "googleapis";

import type { Appointment } from "@prisma/client";
import type { GoogleAppointment } from "./googleApi.lib";
import { KYIV_TIME_ZONE } from "~/utils/constants";
import { sendMail } from "./nodemailer.lib";
import type { ContactInfo } from "~/store/bookingSlice";
import {
  merchantAccount,
  merchantDomainName,
  merchantSecretKey,
} from "~/lib/wayforpay.service";

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

  const events = await calendarAPI.events.list({
    calendarId: CAL_ID,
    timeZone: KYIV_TIME_ZONE,
    timeMin: new Date().toISOString(),
    timeMax: addMonths(new Date(), 3).toISOString(), // 3 months from tomorrow
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

  // console.log({
  //   googleAppointments: googleAppointments
  //     .slice(0, 5)
  //     .map((x) => ({ ...x, ...x.start })),
  //   mappedGoogleAppointments: mappedGoogleAppointments.slice(0, 5),
  // });

  return mappedGoogleAppointments;
}

export async function getAppointmentById(eventId: string) {
  console.log(
    `> Getting an appointment id=${eventId} from Google Calendar API...`
  );

  const authClient = await googleAuth.getClient();
  google.options({ auth: authClient });

  const calendarAppointment = await calendarAPI.events.get({
    calendarId: CAL_ID,
    eventId,
  });

  console.log({ calendarAppointment });
  return calendarAppointment;
}

export async function getPrismaAppointmentById(id: string) {
  console.log(`> Getting an appointment id=${id} from Prisma...`);

  return prisma.appointment.findUnique({ where: { id } });
}

export async function createAppointment(
  appointment: Pick<
    Appointment,
    "date" | "timeFrom" | "timeTo" | "services" | "contactInfo" | "price"
  >
) {
  console.log("> Creating an appointment into Google Calendar API...");
  console.log({ appointment });

  const createEventDTO = {
    calendarId: CAL_ID,
    requestBody: {
      summary: getAppointmentTitle(
        JSON.parse(appointment.contactInfo),
        new Date(appointment.timeFrom),
        new Date(appointment.timeTo),
        appointment.price
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
      colorId: "4", // #ff887c at index 4
      // for later parsing on confirmation screen
      extendedProperties: {
        private: {
          contactInfo: appointment.contactInfo,
          services: appointment.services,
          price: appointment.price,
        },
      },
    },
  };
  const createdEvent = await calendarAPI.events.insert(createEventDTO);
  console.log({ createdEvent: createdEvent.data });

  // send new appointment notification email to admin
  console.log(`> Sending mail to ${process.env.ADMIN_EMAIL}`);
  sendMail({
    text: `${createEventDTO.requestBody.summary}\n\n${new Date(
      appointment.timeFrom
    ).toLocaleDateString("uk")}: ${new Date(
      appointment.timeFrom
    ).toLocaleTimeString("uk", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Kyiv",
    })}–${new Date(appointment.timeTo).toLocaleTimeString("uk", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Kyiv",
    })}\n\n${createEventDTO.requestBody.description}`,
  });

  return createdEvent.data;
}

export async function createPrismaAppointment(
  appointment: Pick<
    Appointment,
    "date" | "timeFrom" | "timeTo" | "services" | "contactInfo" | "price"
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

  return prisma.appointment.create({ data: appointment });
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

export async function deleteAppointment(appointmentId: string) {
  // GOOGLE CALENDAR
  // const res = await calendar.events.delete({
  //   calendarId: CAL_ID,
  //   eventId: appointmentId || "",
  // });
  // console.log(`deleted item ${appointmentId}`);
  // console.log(res);
}

export async function deletePrismaAppointment(appointmentId: string) {
  try {
    return prisma.appointment.delete({ where: { id: appointmentId } });
  } catch (error) {
    console.error(error);
  }
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

export async function generateAppointmentPaymentData({
  id,
  price,
  timeFrom,
  timeTo,
  contactInfo,
}: Pick<Appointment, "id" | "contactInfo" | "price" | "timeFrom" | "timeTo">) {
  const info: ContactInfo = JSON.parse(contactInfo);
  const data = {
    merchantAccount: merchantAccount,
    merchantDomainName: merchantDomainName,
    authorizationType: "SimpleSignature",
    orderReference: `ESCP_${id}`,
    orderDate: Date.now(),
    amount: `${price}.00`,
    currency: "UAH",
    productName: `Бронювання залу студії escp.90 ${new Date(
      timeFrom
    ).toLocaleDateString("uk")}: ${new Date(timeFrom).toLocaleTimeString("uk", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Kyiv",
    })}–${new Date(timeTo).toLocaleTimeString("uk", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Kyiv",
    })}`,
    productPrice: price,
    productCount: "1",
    clientFirstName: info.firstName,
    clientLastName: info.lastName || "Прізвище",
    clientEmail: "some@mail.com",
    clientPhone: info.tel,
    language: "UA",
    // https://wiki.wayforpay.com/view/852102 : paymentSystems
    paymentSystems: "card;googlePay;applePay;privat24;qrCode",
    // defaultPaymentSystem: "applePay",

    merchantSignature: "",
  };
  const hashString = [
    data.merchantAccount,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    data.productName,
    data.productCount,
    data.productPrice,
  ].join(";");

  const hash = crypto
    .createHmac("md5", merchantSecretKey || `flk3409refn54t54t*FNJRET`)
    .update(hashString)
    .digest("hex");
  data.merchantSignature = hash;
  console.log({ hash, data });
  return data;
}
