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
