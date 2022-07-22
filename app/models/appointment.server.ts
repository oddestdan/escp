import { prisma } from "~/db.server";
import type { Appointment } from "@prisma/client";

export type { Appointment } from "@prisma/client";

export async function getAppointments() {
  return prisma.appointment.findMany();
}

export async function createAppointment(
  appointment: Pick<
    Appointment,
    "date" | "timeFrom" | "timeTo" | "services" | "contactInfo"
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
