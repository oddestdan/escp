import cron from "node-cron";
import { prisma } from "~/db.server";

async function deleteExpiredAppointments() {
  console.log("> Running cleanup job...");
  try {
    const result = await prisma.appointment.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    console.log(`> Deleted ${result.count} expired appointments.`);
  } catch (error) {
    console.error("> Error deleting expired appointments:", error);
  }
}

// Run every 5 minutes
cron.schedule("*/5 * * * *", deleteExpiredAppointments);

console.log("> Scheduled appointment cleanup cron job.");
