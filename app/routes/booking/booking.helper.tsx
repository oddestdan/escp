import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { generateAppointmentPaymentData } from "~/lib/wayforpay.service";
import type { Appointment } from "~/models/appointment.server";
import {
  createPrismaAppointment,
  getAppointments,
  getPrismaAppointmentsByDate,
} from "~/models/appointment.server";
import { ENABLE_OVERLAPS } from "~/store/bookingSlice";
import { BOOKING_TIME_TAKEN_QS, STUDIO_ID_QS } from "~/utils/constants";
import { slotOverlapsAnotherSlot } from "~/utils/slots";

export type GeneratedPaymentData = Awaited<
  ReturnType<typeof generateAppointmentPaymentData>
>;
export type AppointmentDTO = Pick<
  Appointment,
  | "studio"
  | "date"
  | "timeFrom"
  | "timeTo"
  | "services"
  | "contactInfo"
  | "price"
  | "studioId"
>;

const handleOverlaps = async (appointmentDTO: AppointmentDTO) => {
  const { studioId, date } = appointmentDTO;

  const todaysPrismaAppointments = await getPrismaAppointmentsByDate(
    studioId,
    date
  );
  const calendarAppointments = await getAppointments(studioId, date);
  const todaysCalendarAppointments = calendarAppointments.filter(
    (app) => app.date === date
  );
  const overlaps = [
    ...todaysPrismaAppointments,
    ...todaysCalendarAppointments,
  ].filter((todays) => slotOverlapsAnotherSlot(todays, appointmentDTO));

  console.log({ todaysPrismaAppointments, overlaps });

  // if the dates match and timeFrom + timeTo are overlapping any of the existing appointments
  if (overlaps.length > 0) {
    return redirect(
      `/booking?${STUDIO_ID_QS}=${studioId}&${BOOKING_TIME_TAKEN_QS}=true`
    );
  }
};

export const handleFormAppointmentCreation = async (formData: FormData) => {
  console.log(">> creating appointment into Prisma");

  const studio = formData.get("studio");
  const date = formData.get("date");
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");
  const services = formData.get("services");
  const contactInfo = formData.get("contactInfo");
  const price = formData.get("price");
  // const price = "1"; // TODO: RETURN --> use bookingSlice IS_DEV
  const studioId = Number(formData.get("studioId"));

  invariant(typeof studio === "string", "studio must be a string");
  invariant(typeof date === "string", "date must be a string");
  invariant(typeof timeFrom === "string", "timeFrom must be a string");
  invariant(typeof timeTo === "string", "timeTo must be a string");
  invariant(typeof services === "string", "services must be a string");
  invariant(typeof contactInfo === "string", "contactInfo must be a string");
  invariant(typeof price === "string", "price must be a string");
  invariant(typeof studioId === "number", "studioId must be a number");

  const appointmentDTO = {
    studio,
    date,
    timeFrom,
    timeTo,
    services,
    contactInfo,
    price,
    studioId,
  };

  if (ENABLE_OVERLAPS) {
    handleOverlaps(appointmentDTO);
  }
  const createdPrismaAppointment = await createPrismaAppointment(
    appointmentDTO
  );
  console.log({ createdPrismaAppointment });
  console.log(
    `Prisma Appointment ${createdPrismaAppointment.id} will self destruct in 10 minutes`
  );

  return createdPrismaAppointment;
};
