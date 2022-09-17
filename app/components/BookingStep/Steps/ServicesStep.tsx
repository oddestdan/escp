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
import { ASSISTANCE_HOURLY_PRICE } from "~/utils/constants";
import { ABOUT_PAGE_PARAM } from "~/utils/pageParams";
import { BookingStepActions } from "../BookingStepActions";
import ReactTooltip from "react-tooltip";

const servicesLabelKeyMapper = {
  [BookingService.assistance]: "допомога асистента (200 грн/год)",
  [BookingService.extra]:
    "додаткові побажання (фон / спеціалізована зйомка / велика группа людей тощо)",
};

const servicesDetailsMapper = {
  [BookingService.assistance]:
    "Асистент допоможе вам з реквізитом, світлом та іншими питаннями",
  [BookingService.extra]:
    "Додайте важливі побажання або інформацію, <br />деталі або категорію вашої зйомки, <br />хто та у якій кількості має бути присутнім на зйомці і т.д.",
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
    assistanceHours &&
      dispatch(
        saveTotalPrice({
          services: assistanceHours * ASSISTANCE_HOURLY_PRICE,
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
    const services = [
      assistance?.checked &&
        assistanceHours &&
        `${assistance.service} ${assistanceHours} год., ${
          ASSISTANCE_HOURLY_PRICE * assistanceHours
        } грн`,
      extra?.checked && `${extra.service}: ${extraService}`,
    ];

    return services.filter(Boolean).join(", ");
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
          to={`/about?${ABOUT_PAGE_PARAM}=1`}
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
                className="my-2 cursor-pointer hover:text-stone-500"
                onClick={() => onChangeCheckbox(i)}
              >
                <input
                  name={service}
                  className="p-1"
                  type="checkbox"
                  checked={checked}
                  readOnly={true}
                />
              </label>
              <span className="pl-2">
                <span
                  className="cursor-pointer hover:text-stone-500"
                  onClick={() => onChangeCheckbox(i)}
                >
                  {servicesLabelKeyMapper[service]}
                </span>

                {/* https://www.npmjs.com/package/react-tooltip */}
                <span
                  className="radius ml-2 inline-block h-[3ch] w-[3ch] rounded-full bg-stone-300 text-center font-mono text-stone-100 hover:bg-stone-400"
                  data-tip={servicesDetailsMapper[service]}
                >
                  i
                </span>
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
                        className={`mb-4 inline-flex cursor-pointer select-none px-2 ${
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
