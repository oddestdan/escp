import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { CopyableCard } from "~/components/CopyableCard/CopyableCard";
import { Separator } from "~/components/Separator/Separator";
import { InstagramIcon, TelegramIcon } from "~/icons";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

export const PaymentStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep, price } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  return (
    <>
      <h4 className="mb-2 text-center font-mono font-medium">оплата</h4>
      <h4 className="mb-2 text-center font-mono text-2xl font-medium underline">
        {price.booking + (price.services || 0)} грн
      </h4>
      <div className="my-4 flex flex-col">
        <BookingSummary />

        <Separator />

        <CopyableCard />

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
        <p className="mb-4 flex text-left xl:text-center">
          <span className="flex items-center">
            Телеграм:{" "}
            <a
              className="ml-1 text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://t.me/escp90"
            >
              <TelegramIcon height="32px" width="32px" />
            </a>
          </span>
          <span className="ml-4 flex items-center">
            Інстаграм:{" "}
            <a
              className="ml-1 text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/escp.90/"
            >
              <InstagramIcon height="32px" width="32px" />
            </a>
          </span>
        </p>
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
