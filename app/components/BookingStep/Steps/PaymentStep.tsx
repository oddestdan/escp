import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { ContactLinks } from "~/components/ContactLinks/ContactLinks";
import { Separator } from "~/components/Separator/Separator";
import { CopyableCard } from "~/components/CopyableCard/CopyableCard";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

import type { StoreBooking } from "~/store/bookingSlice";
import ReactTooltip from "react-tooltip";

const isPaymentWorking = true;

export const PaymentStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep, price } = useSelector(
    (store: StoreBooking) => store.booking
  );

  // Mounted check for React Tooltip
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  return (
    <>
      {/* Standalone Tooltip */}
      {hasMounted && (
        <ReactTooltip
          backgroundColor="#2b2b2b"
          textColor="#ffffff"
          place="top"
          effect="solid"
          multiline
        />
      )}

      <h4 className="mb-2 text-center font-medium">оплата</h4>
      <h4 className="mb-2 text-center text-2xl font-medium underline">
        {price.booking + (price.services || 0)} грн
      </h4>
      <div className="my-4 flex flex-col">
        <BookingSummary />

        <Separator />

        {isPaymentWorking ? (
          <p className="mb-4">
            <span className="mb-1 block">
              Будь-ласка, <span className="font-bold">обов'язково</span>{" "}
              зачекайте переадресації після оплати, щоб побачити
              сторінку-підтвердження.
            </span>
            <span className="block">
              Якщо ви не побачили оновлену сторінку або ваше бронювання не було
              занесено у календар - просимо звернутися до нас.
            </span>
          </p>
        ) : (
          <>
            <CopyableCard />
            <p className="mb-4">
              <span className="mb-2 block">
                Бронювання є дійсним лише після оплати та її підтвердження.
                Оплатити бронювання необхідно протягом 12 годин.
              </span>
              <span className="block">
                Будь-ласка, надайте скрін оплати або певним іншим чином
                повідомте нас про успішний переказ у приватні повідомлення.
              </span>
            </p>
          </>
        )}

        {/* Contact info, links */}
        <p className="mb-4 flex text-left xl:text-center">
          <ContactLinks />
        </p>

        {!isPaymentWorking && (
          <div className="relative">
            <div className="absolute right-[calc(50%-1.5ch)] top-0">
              <span
                className="radius box-content inline-block h-[1.5rem] w-[1.5rem] cursor-pointer rounded-full border-4 border-white bg-stone-300 text-center not-italic text-stone-100 hover:bg-stone-400"
                data-tip={`Ми в процесі оновлення платіжного сервісу,<br/> тому оплата поки що мануальна.<br />Скоро буде краще!`}
              >
                i
              </span>
            </div>
          </div>
        )}
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
