import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { ContactInfo, StoreBooking } from "~/store/bookingSlice";
import { saveContactInfo } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

type RequiredContactInfo = Omit<
  ContactInfo,
  "instagramLink" | "telegramNickname"
>;
const errorKeyMapper: RequiredContactInfo & { terms: string } = {
  firstName: "заповніть ім'я",
  lastName: "заповніть прізвище",
  email: "правильно заповніть імейл",
  tel: "заповніть номер телефону",
  terms: "дайте згоду з нашими правилами",
};

const contactLabelKeyMapper: ContactInfo = {
  firstName: "ім'я",
  lastName: "прізвище",
  email: "імейл",
  tel: "номер телефону",
  instagramLink: "інстаграм посилання",
  telegramNickname: "нікнейм телеграму",
};

export const getContactLabelByKey = (key: string) => {
  return contactLabelKeyMapper[key as keyof ContactInfo];
};

export const ContactInfoStep: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { contact, currentStep } = useSelector(
    (store: StoreBooking) => store.booking
  );
  const [localContactForm, setLocalContactForm] = useState({ ...contact });
  const [hasSeenTerms, setHasSeenTerms] = useState(false);
  const [touched, setTouched] = useState<
    Partial<RequiredContactInfo & { terms: string }>
  >({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    tel: undefined,
    terms: undefined,
  });

  const stepNext = useCallback(() => {
    const { firstName, lastName, email, tel } = localContactForm;
    if (![firstName, lastName, email, tel].every(Boolean)) {
      touched.firstName = firstName.length === 0 ? "" : touched.firstName;
      touched.lastName = lastName.length === 0 ? "" : touched.lastName;
      touched.email = email.length === 0 ? "" : touched.email;
      touched.tel = tel.length === 0 ? "" : touched.tel;
      touched.terms = hasSeenTerms ? undefined : "";
      return setTouched({ ...touched });
    }
    dispatch(saveCurrentStep(currentStep + 1));
    dispatch(saveContactInfo(localContactForm));
  }, [dispatch, currentStep, localContactForm, touched, hasSeenTerms]);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const onCheckTerms = useCallback(() => {
    touched.terms = hasSeenTerms ? "" : undefined;
    setHasSeenTerms(!hasSeenTerms);
  }, [hasSeenTerms, touched]);

  const setContactFormProp = useCallback(
    (key: string, value: string) => {
      localContactForm[key as keyof ContactInfo] = value;
      setLocalContactForm({ ...localContactForm });

      touched[key as keyof Partial<RequiredContactInfo>] = value;
      setTouched(touched);
    },
    [localContactForm, touched]
  );

  const memoedInfo = useMemo(() => {
    const { firstName, lastName, email, tel } = localContactForm;

    if ([firstName, lastName, email, tel].filter(Boolean).length === 0) {
      return "";
    }

    const fullName = firstName ? firstName + " " + (lastName[0] || "") : "";
    return " | " + [fullName, email, tel].filter(Boolean).join(", ");
  }, [localContactForm]);

  return (
    <>
      <h4 className={`mb-2 text-center font-medium`}>
        контактна інформація{memoedInfo}
      </h4>
      <form className="my-4 flex flex-wrap justify-between">
        {Object.entries(localContactForm).map(([key, value], i) => (
          <label
            key={key}
            htmlFor={key}
            className={`mt-2 block w-full sm:w-1/2 ${
              !isMobile ? (i % 2 === 0 ? "pr-2" : "pl-2") : ""
            }`}
          >
            <span className="block text-sm">
              {getContactLabelByKey(key)}
              {i < 4 ? " *" : ""}
            </span>
            <TextInput
              name={key}
              type={
                key === "email"
                  ? "email"
                  : key === "tel"
                  ? "tel"
                  : key === "instagramLink"
                  ? "url"
                  : "text"
              }
              required={i < 4}
              className="mt-2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setContactFormProp(key, e.target.value)
              }
            />
            <p
              className={`mt-1 text-right text-sm text-pink-600 ${
                i < 4 && touched[key as keyof RequiredContactInfo] === ""
                  ? ""
                  : "invisible"
              }`}
            >
              {errorKeyMapper[key as keyof RequiredContactInfo]}
            </p>
          </label>
        ))}
      </form>
      <p className="mb-8">
        <label
          key="terms"
          htmlFor="terms"
          className="flex cursor-pointer hover:text-stone-500"
          onClick={onCheckTerms}
        >
          <input
            name="terms"
            className="p-1"
            type="checkbox"
            checked={hasSeenTerms}
            readOnly={true}
          />
          <span className="ml-2 block text-center text-sm italic">
            ознайомлені та згодні з{" "}
            <Link
              className="text-stone-900 underline hover:text-stone-400"
              target="_blank"
              to="/rules"
            >
              правилами
            </Link>
          </span>
        </label>
        <p
          className={`mt-1 text-left text-sm text-pink-600 ${
            touched.terms === "" ? "" : "invisible"
          }`}
        >
          {errorKeyMapper.terms}
        </p>
      </p>
      <BookingStepActions
        hasPrimary={true}
        onPrimaryClick={stepNext}
        hasSecondary={true}
        onSecondaryClick={stepBack}
      />
    </>
  );
};
