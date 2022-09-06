import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { StoreBooking } from "~/store/bookingSlice";

export const BookingSummary: React.FC = () => {
  const { dateTime, services, contact } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const memoedDateTime = useMemo(() => {
    return `${new Date(dateTime.date).toLocaleDateString("uk")} | ${[
      dateTime.time.start,
      dateTime.time.end || dateTime.time.start,
    ]
      .map((date) => new Date(date).toLocaleTimeString("uk").slice(0, -3))
      .join(" - ")}`;
  }, [dateTime]);

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
      <p className="mb-4">
        <span className="font-medium">додаткові сервіси: </span>
        {services.length > 0 ? services.join(", ") : "-"}
      </p>

      {/* Services */}
      {memoedContactInfo && (
        <p className="mb-4">
          <span className="font-medium">контактна інформація: </span>
          {memoedContactInfo}
        </p>
      )}
    </>
  );
};
