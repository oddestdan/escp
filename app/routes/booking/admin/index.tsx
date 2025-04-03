/* eslint-disable react-hooks/rules-of-hooks */
import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import { BookingService } from "~/store/bookingSlice";
import { getHoursDiffBetweenDates } from "~/utils/date";
import { prettyFormatDate } from "~/components/AdminCalendar/AdminCalendar";

import type { AdminCalendarEvent } from "~/components/AdminCalendar/AdminCalendar";
import type { AdditionalServices, ContactInfo } from "~/store/bookingSlice";

export const getAppointmentTitle = (
  studioId: number,
  info: ContactInfo,
  startDate: Date,
  endDate: Date,
  price: string
): string => {
  if (!info.firstName || !info.tel) {
    return "Incognito";
  }

  const duration = Math.abs(getHoursDiffBetweenDates(endDate, startDate));

  return `R${studioId + 1}, ${duration}h, ${info.firstName}${
    info.lastName ? ` ${info.lastName[0]}.` : ""
  }, ${price}UAH`;
};

export const getAppointmentDescription = (
  description: {
    services: BookingService[];
    additionalServices: AdditionalServices;
  },
  info: ContactInfo
) => {
  if (!description.additionalServices && !description.services) {
    return "--";
  }

  const {
    services,
    additionalServices: { extra, parking },
  } = description;

  const regular = services.filter(
    (s) => s !== BookingService.extra && s !== BookingService.parking
  );
  if (extra) regular.pop();
  if (parking) regular.pop();

  return (
    [
      `${info.firstName}${info.lastName ? ` ${info.lastName}` : ""}`,
      info.tel,
      info.socialMedia || "",
      ...regular,
      `${parking ? `паркінг: "${parking}"` : ""}`,
      `${extra ? `додатково: "${extra}"` : ""}`,
    ]
      .filter((x) => x.length)
      .join("\n") || "-немає додаткової інформації-"
  );
};

export const formatFullAppointment = ({
  title,
  start,
  end,
  id,
  description,
  confirmed,
}: AdminCalendarEvent): string[] => {
  return [
    `Бронювання: ${id}`,
    `Підтверджено: ${confirmed ? "ТАК" : "НІ"}`,
    `Автор: ${title}`,
    `Сервіси: ${description}`,
    `Дата та час: ${prettyFormatDate(new Date(start), new Date(end))}`,
  ].filter(Boolean);
};

export default function AdminBooking() {
  if (Boolean("admin not needed anymore") === true) {
    return (
      <div className="w-100 my-auto flex h-[100vh] flex-col justify-center text-center text-2xl">
        😉
        <br />
        тут нема на що дивитися
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4">
        <NavBar active="admin" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="admin" />
        </div>
      </main>
    </div>
  );
}
