import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { BookingState, StoreBooking } from "~/store/bookingSlice";
import { BookingService } from "~/store/bookingSlice";
import { ASSISTANCE_HOURLY_PRICE } from "~/utils/constants";

type SummaryBookingState = Pick<
  BookingState,
  "dateTime" | "services" | "additionalServices" | "contact" | "price"
>;

export interface BookingSummaryProps {
  summary?: SummaryBookingState;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ summary }) => {
  const { booking } = useSelector((store: StoreBooking) => store);
  const { dateTime, services, additionalServices, contact, price } =
    summary || booking;

  const memoedDateTime = useMemo(() => {
    return `${new Date(dateTime.date).toLocaleDateString("uk")} | ${[
      dateTime.time.start,
      dateTime.time.end || dateTime.time.start,
    ]
      .map((date) => new Date(date).toLocaleTimeString("uk").slice(0, -3))
      .join(" - ")}`.concat(` (${price.booking} грн)`);
  }, [dateTime, price]);

  const memoedSelectedServicesList = useMemo(() => {
    const add =
      additionalServices.assistance &&
      services.find((s) => s === BookingService.assistance) &&
      `${BookingService.assistance}: ${additionalServices.assistance} год. (${
        additionalServices.assistance * ASSISTANCE_HOURLY_PRICE
      } грн)`;

    const regular = services.filter(
      (s) => s !== BookingService.assistance && s !== BookingService.extra
    );

    const ext =
      additionalServices.extra &&
      services.find((s) => s === BookingService.extra) &&
      `${BookingService.extra}: ${additionalServices.extra}`;

    if (additionalServices.extra) regular.pop();

    return [add, ...regular, ext].filter(Boolean).join(", ");
  }, [services, additionalServices.assistance, additionalServices.extra]);

  const memoedContactInfo = useMemo(() => {
    const { firstName, lastName, tel } = contact;

    if ([firstName, lastName, tel].filter(Boolean).length === 0) {
      return "";
    }

    const fullName = firstName ? firstName + " " + (lastName[0] || "") : "";
    return [fullName, tel].filter(Boolean).join(", ");
  }, [contact]);

  return (
    <>
      {/* Date & Time */}
      {memoedDateTime && (
        <p className="mb-4">
          <span className="font-medium">дата & час: </span>
          {memoedDateTime}
        </p>
      )}

      {/* Services */}
      {memoedSelectedServicesList && (
        <p className="mb-4">
          <span className="font-medium">додаткові сервіси: </span>
          {memoedSelectedServicesList}
        </p>
      )}

      {/* ContactInfo */}
      {memoedContactInfo && (
        <p className="mb-4">
          <span className="font-medium">контактна інформація: </span>
          {memoedContactInfo}
        </p>
      )}
    </>
  );
};
