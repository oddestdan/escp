import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { ContactLinks } from "~/components/ContactLinks/ContactLinks";
import { Separator } from "~/components/Separator/Separator";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

import type { StoreBooking } from "~/store/bookingSlice";

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

        {/* <CopyableCard /> */}

        <p className="mb-4">
          <span className="mb-1 block">
            Будь-ласка, <span className="font-bold">обов'язково</span>{" "}
            поверніться до сайту після оплати, щоб побачити
            сторінку-підтвердження.
          </span>
          <span className="block">
            Якщо ви не побачили оновлену сторінку або ваше бронювання не було
            занесено у календар - просимо звернутися до нас.
          </span>
        </p>

        {/* Contact info, links */}
        <p className="mb-4 flex text-left xl:text-center">
          <ContactLinks />
        </p>
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
