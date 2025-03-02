import { useCallback } from "react";
import { useBeforeUnload } from "react-use";
import { deletePrismaAppointment } from "~/models/appointment.server";

export const useDeleteAppointmentBeforeUnload = (appointmentId: string) => {
  const deleteFromPrisma = useCallback(async () => {
    await deletePrismaAppointment(appointmentId);
  }, [appointmentId]);

  useBeforeUnload(() => {
    console.log(`> Deleting from Prisma before unload of /paymentId`);
    deleteFromPrisma();
    return true;
  });
};
