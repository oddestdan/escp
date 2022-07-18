import { prisma } from "~/db.server";
import type { Appointment } from "@prisma/client";

export type { Appointment } from "@prisma/client";

export async function getAppointments() {
  return prisma.appointment.findMany();
}

export async function createAppointment(
  appointment: Pick<Appointment, "date" | "timeFrom" | "timeTo">
) {
  return prisma.appointment.create({ data: appointment });
}
