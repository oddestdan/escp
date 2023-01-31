import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { ContactInfo, StoreBooking } from "~/store/bookingSlice";
import { saveContactInfo } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { LS_HAS_SEEN_TERMS } from "~/utils/constants";
import { ls } from "~/utils/localStorage.service";
import { BookingStepActions } from "../BookingStepActions";
import parsePhoneNumber from "libphonenumber-js";

type RequiredContactInfo = Omit<ContactInfo, "lastName" | "socialMedia">;
const isRequiredContactInfo = (
  keyInput: string
): keyInput is keyof RequiredContactInfo => {
  return ["firstName", "tel"].includes(keyInput);
};

const errorKeyMapper: RequiredContactInfo & {
  terms: string;
  invalidTel: string;
} = {
  firstName: "заповніть ім'я",
  tel: "заповніть номер телефону",
  invalidTel: "формат номера телефону невірний",
  terms: "дайте згоду з нашими правилами",
};

const contactLabelKeyMapper: ContactInfo = {
  firstName: "ім'я",
  lastName: "прізвище",
  tel: "номер телефону",
  socialMedia: "інстаграм або телеграм",
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
  const [hasSeenTerms, setHasSeenTerms] = useState(
    Boolean(ls.getItem(LS_HAS_SEEN_TERMS)) || false
  );
  const [touched, setTouched] = useState<
    Partial<RequiredContactInfo & { terms: string }>
  >({
    firstName: undefined,
    tel: undefined,
    terms: undefined,
  });

  const [invalidTel, setInvalidTel] = useState(false);

  const stepNext = useCallback(() => {
    const { firstName, tel } = localContactForm;
    if (![firstName, tel, hasSeenTerms, !invalidTel].every(Boolean)) {
      touched.firstName = firstName.length === 0 ? "" : touched.firstName;
      touched.tel = tel.length === 0 ? "" : touched.tel;
      touched.terms = hasSeenTerms ? undefined : "";
      return setTouched({ ...touched });
    }
    dispatch(saveCurrentStep(currentStep + 1));
    dispatch(saveContactInfo(localContactForm));
  }, [
    dispatch,
    currentStep,
    localContactForm,
    touched,
    hasSeenTerms,
    invalidTel,
  ]);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const onCheckTerms = useCallback(
    (onlyTrue = false) => {
      touched.terms = hasSeenTerms ? "" : undefined;
      const hasSeen = onlyTrue || !hasSeenTerms;
      setHasSeenTerms(hasSeen);
      ls.setItem(LS_HAS_SEEN_TERMS, "true");
    },
    [hasSeenTerms, touched]
  );

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
    const { firstName, lastName, tel } = localContactForm;

    if ([firstName, lastName, tel].filter(Boolean).length === 0) {
      return "";
    }

    const fullName = firstName
      ? `${firstName}${lastName ? ` ${lastName[0]}` : ""}`
      : "";
    return " | " + [fullName, tel].filter(Boolean).join(", ");
  }, [localContactForm]);

  return (
    <>
      <h4 className={`mb-2 text-center font-mono font-medium`}>
        контактна інформація{memoedInfo}
      </h4>
      <form className="mt-4 flex flex-wrap justify-between">
        {Object.entries(localContactForm).map(([key, defaultValue], i) => {
          const isInvalid = touched[key as keyof RequiredContactInfo] === "";
          return (
            <label
              key={key}
              htmlFor={key}
              className={`mt-2 block w-full sm:w-1/2 ${
                !isMobile ? (i % 2 === 0 ? "pr-2" : "pl-2") : ""
              }`}
            >
              <span className="block font-mono text-sm">
                {getContactLabelByKey(key)}
                {isRequiredContactInfo(key) ? " *" : ""}
              </span>
              <TextInput
                name={key}
                type={
                  key === "tel" ? "tel" : key === "socialMedia" ? "url" : "text"
                }
                required={isRequiredContactInfo(key)}
                className={`mt-2 ${
                  isRequiredContactInfo(key) && isInvalid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                defaultValue={defaultValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let val = e.target.value;
                  if (key === "tel") {
                    if (val.length > 0) {
                      const parsedPhone = parsePhoneNumber(val, "UA");
                      const isValidPhone = parsedPhone?.isValid();
                      setInvalidTel(!isValidPhone);
                      val = parsedPhone?.number || val;
                    } else {
                      setInvalidTel(false);
                    }
                  }

                  setContactFormProp(key, val);
                }}
              />
              {key === "tel" ? (
                <span
                  className={`text-left text-sm text-red-500 ${
                    (isRequiredContactInfo("tel") && isInvalid) || invalidTel
                      ? ""
                      : "invisible"
                  }`}
                >
                  {invalidTel
                    ? errorKeyMapper["invalidTel"]
                    : errorKeyMapper["tel"]}
                </span>
              ) : (
                <span
                  className={`text-left text-sm text-red-500 ${
                    isRequiredContactInfo(key) && isInvalid ? "" : "invisible"
                  }`}
                >
                  {errorKeyMapper[key as keyof RequiredContactInfo] ||
                    "placeholder"}
                </span>
              )}
            </label>
          );
        })}
      </form>
      <p className="my-4">
        <label
          key="terms"
          htmlFor="terms"
          className="inline-flex cursor-pointer hover:text-stone-500"
          onClick={() => onCheckTerms()}
        >
          <input
            name="terms"
            className="p-1"
            type="checkbox"
            checked={hasSeenTerms}
            readOnly={true}
          />
          <span className="ml-2 block text-center font-mono text-sm italic">
            ознайомлені та згодні з{" "}
            <Link
              className="text-stone-900 underline hover:text-stone-400"
              target="_blank"
              to="/rules"
              onClick={() => onCheckTerms(true)}
            >
              правилами
            </Link>
          </span>
        </label>
        <span
          className={`block text-left text-sm text-red-500 ${
            touched.terms === "" ? "" : "invisible"
          }`}
        >
          {errorKeyMapper.terms}
        </span>
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
