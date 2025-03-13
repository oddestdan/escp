import type { Appointment } from "@prisma/client";

export interface CreateEventDTO {
  calendarId?: string;
  requestBody: {
    summary: string;
    description: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    extendedProperties: {
      private: {
        contactInfo: string;
        services: string;
        price: string;
        studio: string;
      };
    };
    colorId: string;
  };
}

export type AppointmentDTO = Pick<
  Appointment,
  | "date"
  | "timeFrom"
  | "timeTo"
  | "services"
  | "contactInfo"
  | "price"
  | "studio"
>;
