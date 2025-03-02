import {
  Form,
  useCatch,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { redirect, json } from "@remix-run/server-runtime";
import { useEffect, useRef, useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import ActiveBookingStep from "~/components/BookingStep/BookingStep";
import { ContactLinks } from "~/components/ContactLinks/ContactLinks";
import type { Appointment } from "~/models/appointment.server";
import {
  createAppointment,
  createPrismaAppointment,
  deletePrismaAppointment,
  getAppointments,
  getPrismaAppointments,
  getPrismaAppointmentsByDate,
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
import { slotOverlapsAnotherSlot } from "~/utils/slots";
import Wrapper from "~/components/Wrapper/Wrapper";

type LoaderData = {
  appointments: GoogleAppointment[];
  prismaAppointments: Appointment[];
  studioId: number;
};

export const action: ActionFunction = async ({ request }) => {
  console.log(">> creating appointment into Prisma");

  const formData = await request.formData();

  const studio = formData.get("studio");
  const date = formData.get("date");
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");
  const services = formData.get("services");
  const contactInfo = formData.get("contactInfo");
  const price = formData.get("price");
  // const price = "1"; // TODO: RETURN --> use bookingSlice IS_DEV
  const studioId = Number(formData.get("studioId"));

  invariant(typeof studio === "string", "studio must be a string");
  invariant(typeof date === "string", "date must be a string");
  invariant(typeof timeFrom === "string", "timeFrom must be a string");
  invariant(typeof timeTo === "string", "timeTo must be a string");
  invariant(typeof services === "string", "services must be a string");
  invariant(typeof contactInfo === "string", "contactInfo must be a string");
  invariant(typeof price === "string", "price must be a string");
  invariant(typeof studioId === "number", "studioId must be a number");

  const appointmentDTO = {
    studio,
    date,
    timeFrom,
    timeTo,
    services,
    contactInfo,
    price,
    studioId,
  };

  const isPaymentWorking = true;
  const enableOverlaps = true;
  if (isPaymentWorking) {
    if (enableOverlaps) {
      const todaysPrismaAppointments = await getPrismaAppointmentsByDate(
        studioId,
        date
      );
      const calendarAppointments = await getAppointments(studioId, date);
      const todaysCalendarAppointments = calendarAppointments.filter(
        (app) => app.date === date
      );
      const overlaps = [
        ...todaysPrismaAppointments,
        ...todaysCalendarAppointments,
      ].filter((todays) => slotOverlapsAnotherSlot(todays, appointmentDTO));

      console.log({ todaysPrismaAppointments, overlaps });

      // if the dates match and timeFrom + timeTo are overlapping any of the existing appointments
      if (overlaps.length > 0) {
        return redirect(
          `/booking?${STUDIO_ID_QS}=${studioId}&${BOOKING_TIME_TAKEN_QS}=true`
        );
      }
    }
    // create Prisma Appointment and redirect to booking/payment

    const createdPrismaAppointment = await createPrismaAppointment(
      appointmentDTO
    );
    console.log({ createdPrismaAppointment });

    console.log(
      `Prisma Appointment ${createdPrismaAppointment.id} will self destruct in 10 minutes`
    );
    setTimeout(
      () => deletePrismaAppointment(createdPrismaAppointment.id),
      1000 * 60 * 10
    );

    return redirect(
      `/booking/payment/${createdPrismaAppointment.id}?${STUDIO_ID_QS}=${studioId}`
    );
  } else {
    const createdAppointment = await createAppointment(
      appointmentDTO,
      studioId
    );
    console.log(createdAppointment);

    if (!createdAppointment) {
      return redirect(`/booking?${BOOKING_TIME_TAKEN_QS}=true`);
    }

    return redirect(
      `/booking/confirmation/${createdAppointment.id}?${STUDIO_ID_QS}=${studioId}`
    );
  }
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
  const submit = useSubmit();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [overrideMaintenance, setOverrideMaintenance] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
      event.preventDefault();
      submit(formRef.current);
    },
    [submit]
  );

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
                  <Form
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
                        IS_DEV
                          ? `1`
                          : `${price.booking + (price.services || 0)}`
                      }
                    />
                    <input type="hidden" name="studioId" value={studioId} />
                    <ActionButton buttonType="submit" onClick={bookAppointment}>
                      оплатити
                    </ActionButton>
                  </Form>
                )}
              </>
            )}
          </>
        }
      />
    </>
  );
}
