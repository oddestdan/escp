import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveTotalPrice } from "~/store/bookingSlice";
import { saveAdditionalServices } from "~/store/bookingSlice";
import { BookingService } from "~/store/bookingSlice";
import { bookingServicesList } from "~/store/bookingSlice";
import { saveServices } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import {
  ASSISTANCE_HOURLY_PRICE,
  INSTAX_CARTRIDGED_PRICE,
  INSTAX_PRICE,
} from "~/utils/constants";
import { BookingStepActions } from "../BookingStepActions";
import ReactTooltip from "react-tooltip";

const servicesLabelKeyMapper = {
  [BookingService.assistance]: "допомога асистента (200 грн/год)",
  [BookingService.instax]: "аренда інстакс (300 грн)",
  [BookingService.instaxCartridged]: "аренда інстакс з картриджами (800 грн)",
  [BookingService.parking]: "мені потрібне паркомісце",
  [BookingService.elevator]: "мені потрібен вантажний ліфт",
  [BookingService.extra]:
    "додаткові побажання (фон / спеціалізована зйомка / велика группа людей тощо)",
};

const servicesDetailsMapper = {
  [BookingService.assistance]:
    "Асистент допомагатиме вам з установкою світла, реквізитом та іншими питаннями",
  [BookingService.instax]: "",
  [BookingService.instaxCartridged]: "",
  [BookingService.parking]: "",
  [BookingService.elevator]: "",
  [BookingService.extra]: "",
  // "Додайте важливі побажання або інформацію, <br />деталі або категорію вашої зйомки, <br />хто та у якій кількості має бути присутнім на зйомці і т.д.",
};

export const ServicesStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep, services, dateTime, additionalServices, price } =
    useSelector((store: StoreBooking) => store.booking);

  const [checkedServices, setCheckedServices] = useState(
    bookingServicesList.map((service) => {
      const checked = services.includes(service);
      return { service, checked };
    })
  );

  const [assistanceHours, setAssistanceHours] = useState<number | undefined>(
    additionalServices.assistance
  );
  const [extraService, setExtraService] = useState(
    additionalServices.extra || ""
  );

  const stepNext = useCallback(() => {
    dispatch(
      saveServices([
        ...checkedServices
          .filter(({ checked }) => checked)
          .map(({ service }) => service),
        ...[extraService].filter(Boolean),
      ])
    );
    dispatch(
      saveAdditionalServices({
        assistance: assistanceHours || undefined,
        extra: extraService.length > 0 ? extraService : undefined,
      })
    );

    // NOTE: 1 or 2 is instax-related stuff
    const instaxPrice = checkedServices[1].checked
      ? INSTAX_PRICE
      : checkedServices[2].checked
      ? INSTAX_CARTRIDGED_PRICE
      : 0;
    const assistancePrice = assistanceHours
      ? assistanceHours * ASSISTANCE_HOURLY_PRICE
      : 0;
    dispatch(
      saveTotalPrice({
        services: instaxPrice + assistancePrice,
        booking: price.booking,
      })
    );
    dispatch(saveCurrentStep(currentStep + 1));
  }, [
    dispatch,
    checkedServices,
    extraService,
    assistanceHours,
    price,
    currentStep,
  ]);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const onChangeCheckbox = useCallback(
    (i: number) => {
      const updatedServices = [...checkedServices];

      // NOTE: 0 is assistance
      if (i === 0 && checkedServices[i].checked) {
        setAssistanceHours(undefined);
      }

      // NOTE: 1 or 2 is instax-related stuff
      [
        [1, 2],
        [2, 1],
      ].forEach(([x, y]) => i === x && (updatedServices[y].checked = false));

      updatedServices[i].checked = !updatedServices[i].checked;
      setCheckedServices(updatedServices);
    },
    [checkedServices]
  );

  const memoedSelectedServicesList = useMemo(() => {
    const assistance = checkedServices.find(
      ({ service }) => service === BookingService.assistance
    );
    const extra = checkedServices.find(
      ({ service }) => service === BookingService.extra
    );

    const assistanceString =
      assistance?.checked &&
      assistanceHours &&
      `${assistance.service}: ${assistanceHours} год. (${
        ASSISTANCE_HOURLY_PRICE * assistanceHours
      } грн)`;
    const extraString =
      extra?.checked &&
      extraService.length > 0 &&
      `${extra.service}: ${extraService}`;

    return [
      assistanceString,
      ...checkedServices
        .filter(
          ({ service, checked }) =>
            checked &&
            service !== BookingService.extra &&
            service !== BookingService.assistance
        )
        .map(({ service }) => service),
      extraString,
    ]
      .filter(Boolean)
      .join(", ");
  }, [checkedServices, extraService, assistanceHours]);

  return (
    <>
      {/* Standalone Tooltip */}
      <ReactTooltip
        backgroundColor="#2b2b2b"
        textColor="#ffffff"
        place="top"
        effect="solid"
        multiline
      />

      <h4 className={`mb-2 text-center font-mono font-medium`}>
        додаткові сервіси
        {memoedSelectedServicesList.length
          ? " | " + memoedSelectedServicesList
          : ""}
      </h4>
      <legend className="mx-auto mb-8 block text-center font-mono text-sm italic">
        весь реквізит (описаний{" "}
        <Link
          className="text-stone-900 underline hover:text-stone-400"
          target="_blank"
          to={`/about`}
        >
          тут
        </Link>
        ) доступний безкоштовно
      </legend>
      <form className="mb-8">
        {checkedServices.map(({ service, checked }, i) => (
          <span key={service}>
            <span className="flex items-center">
              {/* Checkmark + Label + Tooltip */}
              <label
                htmlFor={service}
                className="my-2 cursor-pointer px-2 hover:bg-stone-100 hover:text-stone-500"
                onClick={() => onChangeCheckbox(i)}
              >
                <input
                  name={service}
                  className="cursor-pointer p-1"
                  type="checkbox"
                  checked={checked}
                  readOnly={true}
                />
              </label>
              <span>
                <span
                  className="cursor-pointer hover:text-stone-500"
                  onClick={() => onChangeCheckbox(i)}
                >
                  {servicesLabelKeyMapper[service]}
                </span>

                {/* https://www.npmjs.com/package/react-tooltip */}
                {/* {servicesDetailsMapper[service].length > 0 && ( */}
                <span
                  className={`radius ml-2 inline-block h-[3ch] w-[3ch] rounded-full text-center font-mono ${
                    servicesDetailsMapper[service].length > 0
                      ? "inline-block cursor-pointer bg-stone-300 text-stone-100 hover:bg-stone-400"
                      : "invisible text-white"
                  }`}
                  data-tip={servicesDetailsMapper[service]}
                >
                  i
                </span>
                {/* )} */}
              </span>
            </span>

            {service === BookingService.extra && checked && (
              <label htmlFor="custom" className="mt-4 mb-12 block">
                <TextInput
                  name="custom"
                  type="text"
                  value={extraService}
                  placeholder="додаткові побажання"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExtraService(e.target.value)
                  }
                />
              </label>
            )}
            {service === BookingService.assistance && checked && (
              <div className="block w-full">
                {[...Array(Math.ceil(dateTime.time.diff)).keys()].map(
                  (hours) => {
                    return (
                      <div
                        key={hours}
                        className={`mx-1 mb-4 inline-flex cursor-pointer select-none border-b-[1px] border-stone-800 px-1 ${
                          assistanceHours === hours + 1
                            ? "bg-stone-800 text-stone-100"
                            : ""
                        }`}
                        onClick={() => setAssistanceHours(hours + 1)}
                      >
                        {hours + 1} год.
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </span>
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
