import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useRef } from "react";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import ActiveBookingStep from "~/components/BookingStep/BookingStep";
import Header from "~/components/Header/Header";
import type { Appointment } from "~/models/appointment.server";
import {
  createAppointment,
  getAppointments,
} from "~/models/appointment.server";
import { saveCurrentStep, BookingStep, clearAll } from "~/store/bookingSlice";
import type { StoreBooking } from "~/store/bookingSlice";
import ProgressBar from "~/components/ProgressBar/ProgressBar";
import NavBar from "~/components/NavBar/NavBar";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";

type LoaderData = {
  appointments: Appointment[];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const date = formData.get("date");
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");
  const services = formData.get("services");
  const contactInfo = formData.get("contactInfo");

  invariant(typeof date === "string", "date must be a string");
  invariant(typeof timeFrom === "string", "timeFrom must be a string");
  invariant(typeof timeTo === "string", "timeTo must be a string");
  invariant(typeof services === "string", "services must be a string");
  invariant(typeof contactInfo === "string", "contactInfo must be a string");

  await createAppointment({ date, timeFrom, timeTo, services, contactInfo });

  return redirect("/booking/confirmation");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const appointments = await getAppointments();
  if (!appointments) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ appointments });
};

export default function Booking() {
  const { appointments } = useLoaderData() as LoaderData;
  const dispatch = useDispatch();
  const submit = useSubmit();

  const formRef = useRef<HTMLFormElement>(null);

  const {
    currentStep,
    dateTime: { date: selectedDate, time: selectedTime },
    contact,
    services,
  } = useSelector((store: StoreBooking) => store.booking);

  const memoedStepsData = useMemo(() => {
    return [
      { title: "??????", icon: "??" },
      { title: "??????????????", icon: "??" },
      { title: "????????", icon: "??" },
      { title: "????????????", icon: "o" },
    ];
  }, []);

  const onStepClick = useCallback(
    (step: BookingStep) => {
      // Can only go to previous steps or to next step
      if (currentStep > step) {
        // if (currentStep + 1 === step) {
        // TODO: place errors from ContactInfo into redux
        // and validate this action while checking for redux errors
        // Also, make next step appear unique (black border)
        // so that user is aware that it might be clickable
        dispatch(saveCurrentStep(step));
      }
    },
    [dispatch, currentStep]
  );

  const bookAppointment = useCallback(() => {
    dispatch(clearAll());
    submit(formRef.current);
  }, [submit, dispatch]);

  return (
    <main className="flex min-h-screen w-full flex-col p-4 font-mono">
      <NavBar active="booking" />

      <div className="flex w-full flex-col items-center font-light">
        <Header current="booking" />
        <div className="my-4 w-full sm:w-3/5">
          <ProgressBar
            onStepClick={onStepClick}
            activeIndex={currentStep}
            stepData={memoedStepsData}
          />
          <ActiveBookingStep appointments={appointments} />
          {currentStep === BookingStep.Payment && (
            <Form method="post" className="my-4" ref={formRef}>
              <input type="hidden" name="date" value={selectedDate} />
              <input type="hidden" name="timeFrom" value={selectedTime.start} />
              <input type="hidden" name="timeTo" value={selectedTime.end} />
              <input
                type="hidden"
                name="services"
                value={JSON.stringify(services)}
              />
              <input
                type="hidden"
                name="contactInfo"
                value={JSON.stringify(contact)}
              />
              <input type="hidden" />
              <ActionButton buttonType="submit" onClick={bookAppointment}>
                ????????????????
              </ActionButton>
            </Form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
