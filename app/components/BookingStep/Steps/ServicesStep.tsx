import { Link } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "~/components/TextInput/TextInput";
import type { StoreBooking } from "~/store/bookingSlice";
import {
  saveTotalPrice,
  saveAdditionalServices,
  BookingService,
  bookingServicesList,
  saveServices,
  saveCurrentStep,
} from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import ReactTooltip from "react-tooltip";
import NumberPicker from "~/components/NumberPicker/NumberPicker";

const servicesLabelKeyMapper = {
  // [BookingService.assistance]: "допомога асистента (200 грн/год)",
  [BookingService.instax]: "оренда instax square (300 грн)",
  [BookingService.instaxCartridged]:
    "оренда instax square з картриджем на 10 фото (800 грн)",
  [BookingService.parking]: (
    <span className="flex flex-wrap">
      <span className="mr-1">мені потрібне паркомісце </span>
      <span>
        (одне місце безкоштовно, за додаткові оплата у адміністратора)
      </span>
    </span>
  ),
  [BookingService.elevator]: "мені потрібен вантажний ліфт",
  [BookingService.extra]: (
    <span className="flex flex-wrap">
      <span className="mr-1">додаткові побажання</span>
      <span>(фон / спеціалізована зйомка / велика группа людей тощо)</span>
    </span>
  ),
};

const servicesDetailsMapper = {
  // [BookingService.assistance]:
  //   "Асистент допомагатиме вам з установкою світла, реквізитом та іншими питаннями",
  [BookingService.instax]: "",
  [BookingService.instaxCartridged]: "",
  [BookingService.parking]: "",
  [BookingService.elevator]: "",
  [BookingService.extra]: "",
  // "Додайте важливі побажання або інформацію, <br />деталі або категорію вашої зйомки, <br />хто та у якій кількості має бути присутнім на зйомці і т.д.",
};

export const ServicesStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const { currentStep, services, /*dateTime,*/ additionalServices, price } =
    useSelector((store: StoreBooking) => store.booking);

  const [checkedServices, setCheckedServices] = useState(
    bookingServicesList.map((service) => {
      const checked = services.includes(service);
      return { service, checked };
    })
  );

  // const [assistanceHours, setAssistanceHours] = useState<number | undefined>(
  //   additionalServices.assistance
  // );
  const [parkingService, setParkingService] = useState(
    additionalServices.parking || "1"
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
        ...[parkingService].filter(Boolean),
        ...[extraService].filter(Boolean),
      ])
    );
    dispatch(
      saveAdditionalServices({
        // assistance: assistanceHours || undefined,
        extra: extraService.length > 0 ? extraService : undefined,
        parking: parkingService.length > 0 ? parkingService : undefined,
        // instax: checkedServices[0]?.checked ? BookingService.instax : undefined,
        // instaxCartridged: checkedServices[1]?.checked
        //   ? BookingService.instaxCartridged
        //   : undefined,
      })
    );

    // NOTE: 0 or 1 is instax-related stuff
    // const instaxPrice = checkedServices[0].checked
    //   ? INSTAX_PRICE
    //   : checkedServices[1].checked
    //   ? INSTAX_CARTRIDGED_PRICE
    //   : 0;
    // const assistancePrice = assistanceHours
    //   ? assistanceHours * ASSISTANCE_HOURLY_PRICE
    //   : 0;
    dispatch(
      saveTotalPrice({
        // services: instaxPrice /* + assistancePrice*/,
        booking: price.booking,
      })
    );
    dispatch(saveCurrentStep(currentStep + 1));
  }, [
    dispatch,
    checkedServices,
    parkingService,
    extraService,
    price.booking,
    currentStep,
  ]);

  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const onChangeCheckbox = useCallback(
    (i: number) => {
      const updatedServices = [...checkedServices];

      // NOTE: 0 is assistance
      // if (i === 0 && checkedServices[i].checked) {
      //   setAssistanceHours(undefined);
      // }

      // NOTE: 0 or 1 is instax-related stuff
      // [
      //   [0, 1],
      //   [1, 0],
      // ].forEach(([x, y]) => i === x && (updatedServices[y].checked = false));

      updatedServices[i].checked = !updatedServices[i].checked;
      setCheckedServices(updatedServices);
    },
    [checkedServices]
  );

  const memoedSelectedServicesList = useMemo(() => {
    // const assistance = checkedServices.find(
    //   ({ service }) => service === BookingService.assistance
    // );
    const parking = checkedServices.find(
      ({ service }) => service === BookingService.parking
    );
    const extra = checkedServices.find(
      ({ service }) => service === BookingService.extra
    );

    // const assistanceString =
    //   assistance?.checked &&
    //   assistanceHours &&
    //   `${assistance.service}: ${assistanceHours} год. (${
    //     ASSISTANCE_HOURLY_PRICE * assistanceHours
    //   } грн)`;

    const parkingString =
      parking?.checked &&
      parkingService.length > 0 &&
      `${parking.service}: ${parkingService}`; // TODO: modify

    const extraString =
      extra?.checked &&
      extraService.length > 0 &&
      `${extra.service}: ${extraService}`;

    return [
      // assistanceString,
      ...checkedServices
        .filter(
          ({ service, checked }) =>
            checked &&
            service !== BookingService.parking &&
            service !== BookingService.extra
          // && service !== BookingService.assistance
        )
        .map(({ service }) => service),
      parkingString,
      extraString,
    ]
      .filter(Boolean)
      .join(", ");
  }, [checkedServices, parkingService, extraService]);

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

      <h4 className={`mb-2 text-center font-medium`}>
        додаткові сервіси
        {memoedSelectedServicesList.length
          ? " | " + memoedSelectedServicesList
          : ""}
      </h4>
      <legend className="mx-auto mb-8 block text-center text-sm italic">
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
      <form className="mb-8 flex flex-col gap-y-2">
        {checkedServices.map(({ service, checked }, i) => (
          <div key={service}>
            <div className="flex items-center">
              {/* Checkmark + Label + Tooltip */}
              <label
                htmlFor={service}
                className="mt-2 mb-1 cursor-pointer px-2 hover:bg-stone-100 hover:text-stone-500"
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
                {servicesDetailsMapper[service].length > 0 && (
                  <span
                    className={`radius ml-2 inline-block h-[1.5rem] w-[1.5rem] rounded-full text-center ${
                      servicesDetailsMapper[service].length > 0
                        ? "inline-block cursor-pointer bg-stone-300 text-stone-100 hover:bg-stone-400"
                        : "invisible text-white"
                    }`}
                    data-tip={servicesDetailsMapper[service]}
                  >
                    i
                  </span>
                )}
              </span>
            </div>

            {service === BookingService.parking && checked && (
              <label htmlFor="custom" className="mt-4 mb-2 block">
                <NumberPicker
                  displayHint
                  selectedNumber={
                    parkingService ? Number(parkingService) : undefined
                  }
                  setNumber={setParkingService}
                />
              </label>
            )}

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
            {/* {service === BookingService.assistance && checked && (
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
            )} */}
          </div>
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
