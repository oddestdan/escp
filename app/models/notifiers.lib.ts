import { getUAFormattedFullDateString } from "~/utils/date";
import { studiosData } from "~/utils/studiosData";
import { sendMail } from "./nodemailer.lib";
import { STUDIO_ID_QS } from "~/utils/constants";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import type { ContactInfo } from "~/store/bookingSlice";
import { sendSMS } from "./smsNotificator.lib";
import type { AppointmentDTO, CreateEventDTO } from "~/types/appointment.type";

export const runEmailNotifier = async (
  appointment: AppointmentDTO,
  createEventDTO: CreateEventDTO,
  createdEventId?: string | null
) => {
  if (!createdEventId) {
    console.error({ message: "No createdEventId" });
    return;
  }

  const dateFrom = new Date(appointment.timeFrom);
  const dateTo = new Date(appointment.timeTo);
  const studioInfo: StudioInfo = JSON.parse(appointment.studio);

  console.log(`> Sending mail to ${process.env.ADMIN_EMAIL}`);
  const formattedUADateString = getUAFormattedFullDateString(dateFrom, dateTo);
  const studioId = studiosData.findIndex((s) => s.name === studioInfo.name);

  sendMail(
    {
      text: `${createEventDTO.requestBody.summary}\n
        \n${formattedUADateString}\n
        \n${createEventDTO.requestBody.description}\n
        \n${process.env.SMS_DOMAIN}/booking/confirmation/${createdEventId}?${STUDIO_ID_QS}=${studioId}`,
    },
    `R${studioInfo.name[studioInfo.name.length - 1]}`
  );
};

// send new appointment notification email to admin
export const runSmsNotifier = async (
  appointment: AppointmentDTO,
  createdEventId?: string | null
) => {
  if (!createdEventId) {
    console.error({ message: "No createdEventId" });
    return;
  }

  const dateFrom = new Date(appointment.timeFrom);
  const dateTo = new Date(appointment.timeTo);
  const studioInfo: StudioInfo = JSON.parse(appointment.studio);
  const contactInfo: ContactInfo = JSON.parse(appointment.contactInfo);

  const formattedUADateString = getUAFormattedFullDateString(dateFrom, dateTo);
  const studioId = studiosData.findIndex((s) => s.name === studioInfo.name);

  console.log(`> Sending SMS to ${contactInfo.tel}`);
  sendSMS(
    studioInfo.name,
    formattedUADateString,
    contactInfo.tel,
    createdEventId,
    studioId
  ).catch((error) => {
    console.error({ message: "Error sending SMS", error });
  });
};
