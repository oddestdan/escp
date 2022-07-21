import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
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
import { saveCurrentStep, BookingStep } from "~/store/bookingSlice";
import type { StoreBooking } from "~/store/bookingSlice";
import ProgressBar from "~/components/ProgressBar/ProgressBar";
import { NavBar } from "~/components/NavBar/NavBar";
import { ActionButton } from "~/components/ActionButton/ActionButton";

type LoaderData = {
  appointments: Appointment[];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const date = formData.get("date");
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");

  invariant(typeof date === "string", "date must be a string");
  invariant(typeof timeFrom === "string", "timeFrom must be a string");
  invariant(typeof timeTo === "string", "timeTo must be a string");

  await createAppointment({ date, timeFrom, timeTo });

  return null;
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

  const {
    currentStep,
    dateTime: { date: selectedDate, time: selectedTime },
  } = useSelector((store: StoreBooking) => store.booking);

  const memoedStepsData = useMemo(() => {
    return [
      { title: "час", icon: "ч" },
      { title: "сервіси", icon: "с" },
      { title: "інфо", icon: "і" },
      { title: "оплата", icon: "o" },
    ];
  }, []);

  const onStepClick = useCallback(
    (step: BookingStep) => {
      // if (currentStep > step) {
      dispatch(saveCurrentStep(step));
      // }
    },
    [dispatch, currentStep]
  );

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4 font-mono">
        <NavBar active="booking" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="booking" />
          <div className="my-4 w-full sm:w-3/5">
            <div className={`date-time-picker-container`}>
              <ProgressBar
                onStepClick={onStepClick}
                activeIndex={currentStep}
                stepData={memoedStepsData}
              />
              <ActiveBookingStep appointments={appointments} />
            </div>
            {currentStep === BookingStep.Payment && (
              <Form method="post" className="my-4">
                <input type="hidden" name="date" value={selectedDate} />
                <input
                  type="hidden"
                  name="timeFrom"
                  value={selectedTime.start}
                />
                <input type="hidden" name="timeTo" value={selectedTime.end} />
                <ActionButton buttonType="submit">забукати</ActionButton>
              </Form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
