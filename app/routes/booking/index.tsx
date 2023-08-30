import {
  Form,
  useCatch,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import ActiveBookingStep from "~/components/BookingStep/BookingStep";
import Header from "~/components/Header/Header";
import { ContactLinks } from "~/components/ContactLinks/ContactLinks";
import {
  createAppointment,
  createPrismaAppointment,
  deletePrismaAppointment,
  getAppointments,
  getPrismaAppointmentsByDate,
} from "~/models/appointment.server";
import {
  saveCurrentStep,
  BookingStep,
  setErrorMessage,
  UNDER_MAINTENANCE,
  bookingStepsDisplayData,
} from "~/store/bookingSlice";
import ProgressBar from "~/components/ProgressBar/ProgressBar";
import NavBar from "~/components/NavBar/NavBar";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import {
  BOOKING_TIME_TAKEN_ERROR_MSG,
  BOOKING_TIME_TAKEN_QS,
  ERROR_404_APPOINTMENTS_MSG,
  ERROR_APPOINTMENT_ALREADY_BOOKED,
  ERROR_SOMETHING_BAD_HAPPENED,
  STUDIO_ID_QS,
} from "~/utils/constants";
import { ErrorNotification } from "~/components/ErrorNotification/ErrorNotification";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import type { StoreBooking } from "~/store/bookingSlice";
import type { GoogleAppointment } from "~/models/googleApi.lib";
import { slotOverlapsAnotherSlot } from "~/utils/slots";

type LoaderData = {
  appointments: GoogleAppointment[];
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
  const price = "1"; // formData.get("price");
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
  if (isPaymentWorking) {
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

    // if the dates match and timeFrom + timeTo are overlapping any of the existing appointments
    if (overlaps.length > 0) {
      console.log({ overlaps });
      return redirect(
        `/booking?${STUDIO_ID_QS}=${studioId}&${BOOKING_TIME_TAKEN_QS}=true`
      );
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

    if (!appointments) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({
      appointments,
      studioId,
    });
  } catch (error: any) {
    throw new Response(`Error: ${error.message}`, { status: 500 });
  }
};

const Wrapper = ({ wrappedComponent }: { wrappedComponent: JSX.Element }) => (
  <main className="flex min-h-screen w-full flex-col p-4">
    <NavBar active="booking" />

    <div className="flex w-full flex-1 flex-col items-center font-light ">
      <Header current="booking" />
      <div className="my-4 w-full sm:w-3/5">{wrappedComponent}</div>
    </div>

    <Footer />
  </main>
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
    <Wrapper
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
  const { studioId } = useLoaderData() as LoaderData;
  const submit = useSubmit();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    // https://betterprogramming.pub/4-ways-of-adding-external-js-files-in-reactjs-823f85de3668
    const script = document.createElement("script");
    script.src = "https://secure.wayforpay.com/server/pay-widget.js";
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  useEffect(() => {
    if (searchParams.get(BOOKING_TIME_TAKEN_QS)) {
      dispatch(saveCurrentStep(BookingStep.DateTime));
      searchParams.delete(BOOKING_TIME_TAKEN_QS);
      setSearchParams(searchParams);

      dispatch(setErrorMessage(BOOKING_TIME_TAKEN_ERROR_MSG));
      setTimeout(() => dispatch(setErrorMessage("")), 7000);
    }
  }, [dispatch, searchParams, setSearchParams]);

  return (
    <>
      {/* Fixed ErrorNotification */}
      {errorMessage && <ErrorNotification message={errorMessage} />}

      <Wrapper
        wrappedComponent={
          <>
            <ProgressBar
              onStepClick={onStepClick}
              activeIndex={currentStep}
              stepData={bookingStepsDisplayData}
            />

            {/* const sameAsKyivTimezone = new Date().getTimezoneOffset() === -120; // Intl.DateTimeFormat().resolvedOptions().timeZone */}
            {UNDER_MAINTENANCE || new Date().getTimezoneOffset() > 0 ? (
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
                      value={`${price.booking + (price.services || 0)}`}
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
