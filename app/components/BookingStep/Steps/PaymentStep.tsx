import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { Separator } from "~/components/Separator/Separator";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

const paymentInfo = "4149 6090 1440 7540";

export const PaymentStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const [hasCopied, setHasCopied] = useState(false);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(paymentInfo.replace(/\s/g, ""));
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  }, []);

  return (
    <>
      <h4 className="mb-2 text-center font-mono font-medium">оплата</h4>
      <div className="my-4 flex flex-col">
        <BookingSummary />

        <Separator />

        {/* Credit card credentials / Copy */}
        <p className="flex justify-center">
          <input
            className={`w-pcard inline cursor-text border-2 border-stone-900 bg-stone-100 py-2 px-2 text-center text-stone-900`}
            defaultValue={paymentInfo}
            readOnly={true}
          />
          <button
            className="inline cursor-pointer border-2 border-l-0 border-stone-900 py-2 px-2 text-stone-900 text-stone-900 hover:border-stone-400 hover:text-stone-400"
            onClick={copyToClipboard}
          >
            скопіювати
          </button>
        </p>
        <p
          className={`mt-1 mb-4 text-center text-sm ${
            hasCopied ? "" : "invisible"
          }`}
        >
          номер скопійовано!
        </p>

        {/* Necessary information about payment */}
        <p className="mb-4">
          <span className="mb-2 block">
            Бронювання є дійсним лише після оплати та її підтвердження.
          </span>
          <span className="block">
            Будь-ласка, надайте скрін оплати або певним іншим чином повідомте
            нас про успішний переказ у приватні повідомлення.
          </span>
        </p>

        {/* Contact info, links */}
        <p className="mb-4">
          <span className="mb-2 block">
            Наш Телеграм:{" "}
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
            Наш Інстаграм:{" "}
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
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
