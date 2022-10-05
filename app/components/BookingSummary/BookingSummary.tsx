import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { BookingState, StoreBooking } from "~/store/bookingSlice";
import { BookingService } from "~/store/bookingSlice";

type SummaryBookingState = Pick<
  BookingState,
  "dateTime" | "additionalServices" | "contact" | "price"
>;

export interface BookingSummaryProps {
  summary?: SummaryBookingState;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ summary }) => {
  const { booking } = useSelector((store: StoreBooking) => store);
  const { dateTime, additionalServices, contact, price } = summary || booking;

  const memoedDateTime = useMemo(() => {
    return `${new Date(dateTime.date).toLocaleDateString("uk")} | ${[
      dateTime.time.start,
      dateTime.time.end || dateTime.time.start,
    ]
      .map((date) => new Date(date).toLocaleTimeString("uk").slice(0, -3))
      .join(" - ")}`.concat(`, ${price.booking} грн`);
  }, [dateTime, price]);

  const memoedSelectedServicesList = useMemo(() => {
    const services = [
      additionalServices.assistance &&
        `${BookingService.assistance}: ${additionalServices.assistance} год., ${price.services} грн`,
      additionalServices.extra &&
        `${BookingService.extra}: ${additionalServices.extra}`,
    ];

    return services.filter(Boolean).join(", ");
  }, [additionalServices.assistance, additionalServices.extra, price]);

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
