import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import { bookingServicesList } from "~/store/bookingSlice";
import { saveServices } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

export const ServicesStep: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { currentStep, services } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const [checkedServices, setCheckedServices] = useState(
    bookingServicesList.map((service) => {
      const checked = services.includes(service);
      return { service, checked };
    })
  );
  const [customService, setCustomService] = useState("");

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
    dispatch(
      saveServices([
        ...checkedServices
          .filter(({ checked }) => checked)
          .map(({ service }) => service),
        ...[customService].filter(Boolean),
      ])
    );
  }, [dispatch, currentStep, customService, checkedServices]);

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
    return [
      ...checkedServices
        .filter(({ checked }) => checked)
        .map(({ service }) => service),
      ...[customService].filter(Boolean),
    ];
  }, [checkedServices, customService]);

  return (
    <>
      <h4 className={`mb-2 text-center font-medium`}>
        ?????????????????? ??????????????
        {memoedSelectedServicesList.length
          ? " | " + memoedSelectedServicesList.length
          : ""}
      </h4>
      <legend className="mx-auto mb-8 block text-center text-sm italic">
        ???????? ???????????????? (????????????????{" "}
        <Link
          className="text-stone-900 underline hover:text-stone-400"
          target="_blank"
          to="/about"
        >
          ??????
        </Link>
        ) ?????????????????? ??????????????????????
      </legend>
      <form>
        {checkedServices.map(({ service, checked }, i) => (
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
            <span className="ml-2">{service}</span>
          </label>
        ))}
        <label htmlFor="custom" className="my-8 block">
          <span className="block text-sm">
            ?????????????????? ??????????????????
            {!isMobile
              ? " (?????? / ???????????????????????????? ???????????? / ???????????? ???????????? ?????????? ????????)"
              : ""}
          </span>
          {/* TODO: save to Redux and set defaultValue from there */}
          <TextInput
            name="custom"
            type="text"
            className="mt-2"
            value={customService}
            placeholder="?????????????????? ??????????????????"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomService(e.target.value)
            }
          />
        </label>
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
