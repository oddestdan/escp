import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import { BookingService } from "~/store/bookingSlice";
import { bookingServicesList } from "~/store/bookingSlice";
import { saveServices } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

const servicesLabelKeyMapper = {
  [BookingService.assistance]: "допомога асистента (200 грн/год)",
  [BookingService.additional]:
    "додаткові побажання (фон / спеціалізована зйомка / велика группа людей тощо)",
};

export const ServicesStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep, services, dateTime } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const [checkedServices, setCheckedServices] = useState(
    bookingServicesList.map((service) => {
      const checked = services.includes(service);
      return { service, checked };
    })
  );

  const [assistanceHours, setAssistanceHours] = useState<number | null>(null);
  const [additionalService, setAdditionalService] = useState("");

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
    dispatch(
      saveServices([
        ...checkedServices
          .filter(({ checked }) => checked)
          .map(({ service }) => service),
        ...[additionalService].filter(Boolean),
      ])
    );
  }, [dispatch, currentStep, additionalService, checkedServices]);

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
    const additional = checkedServices.find(
      ({ service }) => service === BookingService.additional
    );
    const services = [
      assistance?.checked &&
        `${assistance.service} ${assistanceHours || 0} год`,
      additional?.checked && `${additional.service}: ${additionalService}`,
    ];

    return services.filter(Boolean).join(", ");
  }, [checkedServices, additionalService, assistanceHours]);

  return (
    <>
      <h4 className={`mb-2 text-center font-mono font-medium`}>
        додаткові сервіси
        {memoedSelectedServicesList.length
          ? " | " + memoedSelectedServicesList
          : ""}
      </h4>
      <legend className="mx-auto mb-8 block text-center font-mono text-sm italic">
        {/* TODO: adapt to new link format after completing working on About page */}
        весь реквізит (описаний{" "}
        <Link
          className="text-stone-900 underline hover:text-stone-400"
          target="_blank"
          to="/about"
        >
          тут
        </Link>
        ) доступний безкоштовно
      </legend>
      <form className="mb-8">
        {checkedServices.map(({ service, checked }, i) => (
          <>
            {/* Checkmark + Label */}
            <label
              key={service}
              htmlFor={service}
              className="my-4 flex cursor-pointer hover:text-stone-500"
              onClick={() => onChangeCheckbox(i)}
            >
              <input
                name={service}
                className="p-1"
                type="checkbox"
                checked={checked}
                readOnly={true}
              />
              <span className="ml-2">{servicesLabelKeyMapper[service]}</span>
            </label>

            {/* Additional input */}
            {service === BookingService.additional && checked && (
              <label htmlFor="custom" className="my-4 block">
                {/* TODO: save to Redux and set defaultValue from there */}
                <TextInput
                  name="custom"
                  type="text"
                  value={additionalService}
                  placeholder="додаткові побажання"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAdditionalService(e.target.value)
                  }
                />
              </label>
            )}
            {service === BookingService.assistance &&
              checked &&
              [...Array(Math.ceil(dateTime.time.diff)).keys()].map((hours) => {
                return (
                  <div
                    key={hours}
                    className={`mb-2 inline-flex cursor-pointer select-none px-2 ${
                      assistanceHours === hours + 1
                        ? "bg-stone-800 text-stone-100"
                        : ""
                    }`}
                    onClick={() => setAssistanceHours(hours + 1)}
                  >
                    {hours + 1} год
                  </div>
                );
              })}
          </>
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
