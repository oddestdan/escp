import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

const paymentInfo = "5375 4141 0764 7256";

export const PaymentStep: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const [hasCopied, setHasCopied] = useState(false);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(paymentInfo.replace("/s/g", ""));
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  }, []);

  return (
    <>
      <h4 className="mb-2 text-center font-medium">оплата</h4>
      <div className="mt-4 mb-8 flex flex-col text-center">
        <pre
          className="mx-auto inline cursor-pointer bg-stone-100 py-2 px-4 text-stone-900 hover:bg-stone-300 hover:text-stone-700"
          onClick={copyToClipboard}
        >
          {paymentInfo}
        </pre>
        {hasCopied && (
          <p className={`mt-1 text-center text-sm`}>номер скопійовано!</p>
        )}
        {/* <ActionButton inverted={true} onClick={copyToClipboard}> */}
        {/* Скопіювати */}
        {/* </ActionButton> */}
      </div>
      <BookingStepActions hasSecondary={true} onSecondaryClick={stepBack} />
    </>
  );
};
