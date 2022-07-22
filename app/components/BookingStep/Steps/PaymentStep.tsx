import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { addMinutes } from "~/utils/date";
import { BookingStepActions } from "../BookingStepActions";

const paymentInfo = "4149 6090 1440 7540";

export const PaymentStep: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { currentStep, dateTime, services, contact } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const [hasCopied, setHasCopied] = useState(false);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(paymentInfo.replace(/\s/g, ""));
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  }, []);

  const memoedDateTime = useMemo(() => {
    return `${new Date(dateTime.date).toLocaleDateString("uk")} | ${[
      dateTime.time.start,
      addMinutes(dateTime.time.end || dateTime.time.start, 30),
    ]
      .map((date) => new Date(date).toLocaleTimeString("uk").slice(0, -3))
      .join(" - ")}`;
  }, [dateTime]);

  const memoedContactInfo = useMemo(() => {
    const { firstName, lastName, email, tel } = contact;

    if ([firstName, lastName, email, tel].filter(Boolean).length === 0) {
      return "";
    }

    const fullName = firstName ? firstName + " " + (lastName[0] || "") : "";
    return [fullName, email, tel].filter(Boolean).join(", ");
  }, [contact]);

  return (
    <>
      <h4 className="mb-2 text-center font-medium">оплата</h4>
      <div className="my-4 flex flex-col">
        <p className="mb-4">
          <span className="mb-2 block">
            бронювання є дійсним лише після оплати та її підтвердження.
          </span>
          <span className="block">
            будь-ласка, надайте скрін оплати або певним іншим чином повідомте
            нас про успішний переказ у приватні повідомлення.
          </span>
        </p>
        <p className="mb-4">
          <span className="mb-2 block">
            наша телега:{" "}
            <a
              className="mb-2 text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://t.me/escp90"
            >
              https://t.me/escp90
            </a>
          </span>
          <span className="mb-2 block">
            наша інста:{" "}
            <a
              className="mb-2 text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/escp.90/"
            >
              https://www.instagram.com/escp.90/
            </a>
          </span>
        </p>
        <p className="mt-4 flex justify-center">
          <input
            className="inline cursor-text border-2 border-stone-900 bg-stone-100 py-2 pr-4 text-right text-stone-900"
            defaultValue={paymentInfo}
            readOnly={true}
          />
          <button
            className="inline cursor-pointer border-2 border-l-0 border-stone-900 py-2 px-4 text-stone-900 text-stone-900 hover:border-stone-400 hover:text-stone-400"
            onClick={copyToClipboard}
          >
            Скопіювати
          </button>
        </p>
        <p
          className={`mt-1 mb-4 text-center text-sm ${
            hasCopied ? "" : "invisible"
          }`}
        >
          номер скопійовано!
        </p>
        <p className="mb-4 border-b-2 border-stone-900">{/* Separator */}</p>

        {/* Date & Time */}
        <p className="mb-4">
          <span className="font-medium">дата & час: </span>
          {memoedDateTime}
        </p>

        {/* Services */}
        <p className="mb-4">
          <span className="font-medium">сервіси: </span>
          {services.join(", ")}
        </p>

        {/* Services */}
        <p className="mb-4">
          <span className="font-medium">контактна інформація: </span>
          {memoedContactInfo}
        </p>
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
