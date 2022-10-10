import { prisma } from "~/db.server";
import type { Appointment } from "@prisma/client";

export type { Appointment } from "@prisma/client";

export async function getAppointments() {
  return prisma.appointment.findMany();
}

export async function getAppointmentById(id: string) {
  return prisma.appointment.findUnique({ where: { id } });
}

export async function createAppointment(
  appointment: Pick<
    Appointment,
    "date" | "timeFrom" | "timeTo" | "services" | "contactInfo" | "price"
  >
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      date: appointment.date,
    },
  });
  const isAppointmentTaken = appointments
    .map(({ timeFrom, timeTo }) => [timeFrom, timeTo])
    .some(
      ([from, to]) =>
        (appointment.timeFrom >= from && appointment.timeFrom < to) ||
        (appointment.timeTo > from && appointment.timeTo <= to)
    );

  if (isAppointmentTaken) {
    console.log("Appointment already taken");
    return null;
  }

  return prisma.appointment.create({ data: appointment });
}

export async function updateAppointment(
  appointment: Pick<Appointment, "date" | "timeFrom" | "timeTo" | "id">
) {
  return prisma.appointment.update({
    where: { id: appointment.id },
    data: appointment,
  });
}

export async function deleteAppointment(appointmentId: string) {
  return prisma.appointment.delete({ where: { id: appointmentId } });
}

export async function confirmAppointment(
  appointmentId: string,
  confirmed = true
) {
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { confirmed: confirmed },
  });
}
