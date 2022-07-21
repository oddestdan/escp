import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveContactInfo } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

export const ContactInfoStep: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { contact, currentStep } = useSelector(
    (store: StoreBooking) => store.booking
  );
  const [localContactForm, setLocalContactForm] = useState({ ...contact });

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
    dispatch(saveContactInfo(localContactForm));
  }, [dispatch, currentStep, localContactForm]);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  // TODO: get proper type for contact info keys
  const setContactFormProp = useCallback(
    (key: string, value: string) => {
      console.log(`setting ${key} with ${value}`);
      // @ts-ignore:
      localContactForm[key] = value;
      setLocalContactForm(localContactForm);
    },
    [localContactForm]
  );

  return (
    <>
      <h4 className={`mb-2 text-center font-medium`}>
        {/* if any filled - display " | " and show basic info, CHECK MOBILE */}
        контактна інформація{[1].length ? " | " + [1].length : ""}
      </h4>
      <form className="my-8 flex flex-wrap justify-between">
        {Object.entries(localContactForm).map(([key, value], i) => (
          <label
            key={key}
            htmlFor={key}
            className={`my-2 block w-full sm:w-1/2 ${
              !isMobile ? (i % 2 === 0 ? "pr-4" : "pl-4") : ""
            }`}
          >
            <span className="block text-sm">{key}</span>
            <TextInput
              name={key}
              type={
                key === "email" ? "email" : key === "phone" ? "phone" : "text"
              }
              className="mt-2"
              // value={value} // TODO: getContactLabelByKey(value)
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setContactFormProp(key, e.target.value)
              }
            />
          </label>
        ))}
      </form>
      <BookingStepActions
        hasPrimary={true}
        onPrimaryClick={stepNext}
        hasSecondary={true}
        onSecondaryClick={stepBack}
      />
    </>
  );
};
