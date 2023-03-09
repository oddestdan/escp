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
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import ActiveBookingStep from "~/components/BookingStep/BookingStep";
import Header from "~/components/Header/Header";
import {
  createPrismaAppointment,
  getAppointments,
} from "~/models/appointment.server";
import {
  saveCurrentStep,
  BookingStep,
  setErrorMessage,
} from "~/store/bookingSlice";
import ProgressBar from "~/components/ProgressBar/ProgressBar";
import NavBar from "~/components/NavBar/NavBar";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import {
  BOOKING_TIME_TAKEN_ERROR_MSG,
  BOOKING_TIME_TAKEN_QS,
  ERROR_404_APPOINTMENTS_MSG,
  ERROR_SOMETHING_BAD_HAPPENED,
} from "~/utils/constants";
import { ErrorNotification } from "~/components/ErrorNotification/ErrorNotification";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import type { StoreBooking } from "~/store/bookingSlice";
import type { GoogleAppointment } from "~/models/googleApi.lib";

type LoaderData = {
  appointments: GoogleAppointment[];
};

export const action: ActionFunction = async ({ request }) => {
  console.log(">> creating appointment into Prisma");

  const formData = await request.formData();

  const date = formData.get("date");
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");
  const services = formData.get("services");
  const contactInfo = formData.get("contactInfo");
  const price = formData.get("price");

  invariant(typeof date === "string", "date must be a string");
  invariant(typeof timeFrom === "string", "timeFrom must be a string");
  invariant(typeof timeTo === "string", "timeTo must be a string");
  invariant(typeof services === "string", "services must be a string");
  invariant(typeof contactInfo === "string", "contactInfo must be a string");
  invariant(typeof price === "string", "price must be a string");

  const appointmentDTO = {
    date,
    timeFrom,
    timeTo,
    services,
    contactInfo,
    price,
  };

  const createdPrismaAppointment = await createPrismaAppointment(
    appointmentDTO
  );
  console.log({ createdPrismaAppointment });

  return redirect(`/booking/payment/${createdPrismaAppointment.id}`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const appointments = await getAppointments();

    if (!appointments) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({
      appointments,
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

  return (
    <Wrapper
      wrappedComponent={
        <>
          <div className="mb-4 text-xl font-medium text-red-500">
            Помилка {caught.status} {caught.statusText}
          </div>

          <div className="w-full bg-white">
            <span className="text-red-500">
              {caught.status === 404
                ? ERROR_404_APPOINTMENTS_MSG
                : ERROR_SOMETHING_BAD_HAPPENED}
            </span>
          </div>
        </>
      }
    />
  );
}

export default function Booking() {
  const { appointments } = useLoaderData() as LoaderData;
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

  const memoedStepsData = useMemo(
    () => [
      { title: "час", icon: "ч" },
      { title: "сервіси", icon: "с" },
      { title: "інфо", icon: "і" },
      { title: "оплата", icon: "o" },
    ],
    []
  );

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
              stepData={memoedStepsData}
            />
            <ActiveBookingStep appointments={appointments} />
            {currentStep === BookingStep.Payment && (
              <Form method="post" className="inline-block w-1/2" ref={formRef}>
                <input type="hidden" name="date" value={selectedDate} />
                <input
                  type="hidden"
                  name="timeFrom"
                  value={selectedTime.start}
                />
                <input type="hidden" name="timeTo" value={selectedTime.end} />
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
                <ActionButton buttonType="submit" onClick={bookAppointment}>
                  оплатити
                </ActionButton>
              </Form>
            )}
          </>
        }
      />
    </>
  );
}
