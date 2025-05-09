import {
  useCatch,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { useEffect, useRef, useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ActiveBookingStep from "~/components/BookingStep/BookingStep";
import { ContactLinks } from "~/components/ContactLinks/ContactLinks";
import type { Appointment } from "~/models/appointment.server";
import {
  getAppointments,
  getPrismaAppointments,
} from "~/models/appointment.server";
import {
  saveCurrentStep,
  BookingStep,
  setErrorMessage,
  BOOKING_UNDER_MAINTENANCE,
  bookingStepsDisplayData,
  IS_DEV,
} from "~/store/bookingSlice";
import ProgressBar from "~/components/ProgressBar/ProgressBar";
import {
  ActionButton,
  invertedClass,
} from "~/components/ActionButton/ActionButton";
import {
  BOOKING_TIME_TAKEN_ERROR_MSG,
  BOOKING_TIME_TAKEN_QS,
  ERROR_404_APPOINTMENTS_MSG,
  ERROR_APPOINTMENT_ALREADY_BOOKED,
  ERROR_SOMETHING_BAD_HAPPENED,
  ERROR_WFP_UNSUCCESSFUL,
  STUDIO_ID_QS,
  WFP_ERROR_QS,
} from "~/utils/constants";
import { ErrorNotification } from "~/components/ErrorNotification/ErrorNotification";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import type { StoreBooking } from "~/store/bookingSlice";
import type { GoogleAppointment } from "~/models/googleApi.lib";
import Wrapper from "~/components/Wrapper/Wrapper";
import type { GeneratedPaymentData } from "./booking.helper";
import { handleFormAppointmentCreation } from "./booking.helper";
import { generateAppointmentPaymentData } from "~/lib/wayforpay.service";

type LoaderData = {
  appointments: GoogleAppointment[];
  prismaAppointments: Appointment[];
  studioId: number;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { createdPrismaAppointment, preCreatedCalendarAppointmentId } =
    await handleFormAppointmentCreation(formData);

  const paymentData = await generateAppointmentPaymentData(
    createdPrismaAppointment,
    preCreatedCalendarAppointmentId
  );

  console.log({
    paymentData,
    preCreatedCalendarAppointmentId,
  });

  return json({ paymentData });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const defaultStudioId = 0;

  const url = new URL(request.url);
  const studioId = Number(
    url.searchParams.get(STUDIO_ID_QS) ?? defaultStudioId
  );

  try {
    const appointments = await getAppointments(studioId);
    const prismaAppointments = await getPrismaAppointments(studioId);

    if (!appointments) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({
      prismaAppointments,
      appointments,
      studioId,
    });
  } catch (error: any) {
    throw new Response(`Error: ${error.message}`, { status: 500 });
  }
};

const BookingWrapper = ({
  wrappedComponent,
}: {
  wrappedComponent: JSX.Element;
}) => (
  <Wrapper activePage="booking">
    <div className="flex w-full flex-1 flex-col items-center font-light ">
      <div className="w-full sm:w-3/5">{wrappedComponent}</div>
    </div>
  </Wrapper>
);

export function CatchBoundary() {
  const caught = useCatch();

  let errorStatus = "";
  switch (caught.status) {
    case 404:
      errorStatus = ERROR_404_APPOINTMENTS_MSG;
      break;
    case 502:
      errorStatus = ERROR_APPOINTMENT_ALREADY_BOOKED;
      break;

    default:
      errorStatus = ERROR_SOMETHING_BAD_HAPPENED;
      break;
  }

  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <div className="mb-4 text-xl font-medium text-red-500">
            Помилка {caught.status} {caught.statusText}
          </div>

          <div className="w-full bg-white">
            <span className="text-red-500">{errorStatus}</span>
          </div>
        </>
      }
    />
  );
}

export default function Booking() {
  const { studioId } = useLoaderData() as unknown as LoaderData;
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  const [overrideMaintenance, setOverrideMaintenance] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const paymentFormRef = useRef<HTMLFormElement>(null);
  const [paymentData, setPaymentData] = useState<GeneratedPaymentData | null>(
    null
  );
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);

  useEffect(() => {
    if (hasSubmittedPayment) {
      setTimeout(() => setHasSubmittedPayment(false), 5000);
    }
  }, [hasSubmittedPayment]);

  const {
    currentStep,
    dateTime: { date: selectedDate, time: selectedTime },
    contact,
    services,
    additionalServices,
    price,
    errorMessage,
    studio,
  } = useSelector((store: StoreBooking) => store.booking);

  const onStepClick = useCallback(
    (step: BookingStep) => {
      // Can only go to previous steps OR
      // TODO: step that has been filled already
      if (currentStep > step) {
        dispatch(saveCurrentStep(step));
      }
    },
    [dispatch, currentStep]
  );

  const bookAppointment = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      setHasSubmittedPayment(true);
      event.preventDefault();
      fetcher.submit(formRef.current, { method: "post" });
    },
    [fetcher]
  );

  // effect to run WFP once payment data is generated
  useEffect(() => {
    if (fetcher.data && fetcher.data.paymentData) {
      setPaymentData(fetcher.data.paymentData);
      setTimeout(() => paymentFormRef.current?.submit(), 1000);
    }
  }, [fetcher.data]);

  // effect to display WFP payment error
  useEffect(() => {
    if (searchParams.get(WFP_ERROR_QS)) {
      searchParams.delete(WFP_ERROR_QS);
      setSearchParams(searchParams);

      dispatch(setErrorMessage(ERROR_WFP_UNSUCCESSFUL));
      setTimeout(() => dispatch(setErrorMessage("")), 10000);
    }
  }, [dispatch, searchParams, setSearchParams]);

  // effect to display "Booking slot already taken" error
  useEffect(() => {
    if (searchParams.get(BOOKING_TIME_TAKEN_QS)) {
      dispatch(saveCurrentStep(BookingStep.DateTime));
      searchParams.delete(BOOKING_TIME_TAKEN_QS);
      setSearchParams(searchParams);

      dispatch(setErrorMessage(BOOKING_TIME_TAKEN_ERROR_MSG));
      setTimeout(() => dispatch(setErrorMessage("")), 10000);
    }
  }, [dispatch, searchParams, setSearchParams]);

  if (BOOKING_UNDER_MAINTENANCE && !overrideMaintenance) {
    return (
      <BookingWrapper
        wrappedComponent={
          <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center text-stone-800">
            <h3 className="text-2xl font-semibold">
              Наразі{" "}
              <span onDoubleClick={() => setOverrideMaintenance(true)}>
                сайт
              </span>{" "}
              оновлюється
            </h3>
            <p className="mt-4 flex items-center gap-x-4">
              <a
                className={`px-4 py-1 ${invertedClass}`}
                href="https://calendar.google.com/calendar/embed?src=sepd88tfbu0lamcultu9uuivdc%40group.calendar.google.com&ctz=Europe%2FKiev&wkst=1"
                target="_blank"
                rel="noreferrer"
              >
                room 1
              </a>
              <a
                className={`px-4 py-1 ${invertedClass}`}
                href="https://calendar.google.com/calendar/embed?src=d713ad72fa246089c84c1666a282e883b5d3887d081af3b406f230adf8ac5a65%40group.calendar.google.com&ctz=Europe%2FKiev"
                target="_blank"
                rel="noreferrer"
              >
                room 2
              </a>
              <a
                className={`px-4 py-1 ${invertedClass}`}
                href="https://calendar.google.com/calendar/embed?src=3d1681a08dd91228dbe36c6adfc779b983d54ed7a52e90962d0810e36577def5%40group.calendar.google.com&ctz=Europe%2FKiev"
                target="_blank"
                rel="noreferrer"
              >
                room 3
              </a>
            </p>
            <p className="mt-4">
              Напишіть нам, з радістю допоможемо забронювати потрібний час.
            </p>
            <p className="my-4 flex justify-center">
              <ContactLinks />
            </p>
          </div>
        }
      />
    );
  }

  return (
    <>
      {/* Fixed ErrorNotification */}
      {errorMessage && <ErrorNotification message={errorMessage} />}

      <BookingWrapper
        wrappedComponent={
          <>
            <ProgressBar
              onStepClick={onStepClick}
              activeIndex={currentStep}
              stepData={bookingStepsDisplayData}
            />

            {/* const sameAsKyivTimezone = new Date().getTimezoneOffset() === -120; // Intl.DateTimeFormat().resolvedOptions().timeZone */}
            {new Date().getTimezoneOffset() > 0 ? (
              <div className="w-full">
                <p className="text-center text-red-500">
                  {new Date().getTimezoneOffset()} |{" "}
                  {Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone}
                  <br />
                  йой, на жаль наш календарик не синхронізується з вашим часовим
                  поясом :(
                  <br />
                  напишіть нам, з радістю допоможемо забронювати потрібний час.
                </p>
                <p className="my-4 flex justify-center text-center">
                  <ContactLinks />
                </p>
              </div>
            ) : (
              <>
                <ActiveBookingStep />
                {currentStep === BookingStep.Payment && (
                  <>
                    <fetcher.Form
                      method="post"
                      className="inline-block w-1/2"
                      ref={formRef}
                    >
                      <input
                        type="hidden"
                        name="studio"
                        value={JSON.stringify(studio)}
                      />
                      <input type="hidden" name="date" value={selectedDate} />
                      <input
                        type="hidden"
                        name="timeFrom"
                        value={selectedTime.start}
                      />
                      <input
                        type="hidden"
                        name="timeTo"
                        value={selectedTime.end}
                      />
                      <input
                        type="hidden"
                        name="services"
                        value={JSON.stringify({ services, additionalServices })}
                      />
                      <input
                        type="hidden"
                        name="contactInfo"
                        value={JSON.stringify(contact)}
                      />
                      <input
                        type="hidden"
                        name="price"
                        value={
                          IS_DEV || contact?.lastName === "test123123"
                            ? `1`
                            : `${price.booking + (price.services || 0)}`
                        }
                      />
                      <input type="hidden" name="studioId" value={studioId} />
                      <ActionButton
                        buttonType="submit"
                        onClick={bookAppointment}
                        disabled={hasSubmittedPayment}
                      >
                        оплатити
                      </ActionButton>
                    </fetcher.Form>
                    {paymentData && (
                      <form
                        method="post"
                        ref={paymentFormRef}
                        action="https://secure.wayforpay.com/pay"
                        encType="application/x-www-form-urlencoded"
                      >
                        {Object.entries(paymentData).map(([key, value]) => (
                          <input
                            key={key}
                            type="hidden"
                            name={key}
                            value={value}
                          />
                        ))}
                      </form>
                    )}
                  </>
                )}
              </>
            )}
          </>
        }
      />
    </>
  );
}
