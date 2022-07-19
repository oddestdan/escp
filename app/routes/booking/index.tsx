import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import DatePicker from "~/components/DatePicker/DatePicker";
import TimePicker from "~/components/TimePicker/TimePicker";
import Header from "~/header";
import type { Appointment } from "~/models/appointment.server";
import {
  createAppointment,
  getAppointments,
} from "~/models/appointment.server";
import NavBar from "~/navbar";
import type { BookingState } from "~/store/bookingSlice";
import { saveTime, saveDate } from "~/store/bookingSlice";
import { generateTimeSlots } from "~/utils/slots";

type LoaderData = {
  appointments: Appointment[];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log("formData");
  console.log(Object.fromEntries(formData));

  const allAppointments = await getAppointments();

  console.log("allAppointments");
  console.log(allAppointments);

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
  const selectedDate = useSelector(
    (store: { booking: BookingState }) => store.booking.dateTime.date
  );
  const selectedTime = useSelector(
    (store: { booking: BookingState }) => store.booking.dateTime.time
  );
  const dateTimeSlots = useSelector(
    (store: { booking: BookingState }) => store.booking.dateTime.slots
  );
  const onChangeDate = useCallback(
    (date: string) => {
      dispatch(saveDate(date));
    },
    [dispatch]
  );

  const onChangeTime = useCallback(
    (start: string, end: string) => {
      dispatch(saveTime({ start, end }));
    },
    [dispatch]
  );

  const memoedTimeSlots = useMemo(() => {
    const todaysSlots =
      dateTimeSlots.find(({ date }) => date === selectedDate)
        ?.availableTimeSlots || [];
    const todaysAppointments =
      appointments.filter(({ date }) => date === selectedDate) || [];

    const takenSlots = todaysAppointments.map((app) => {
      const timeFromArr = app.timeFrom.split("T")[1].split(":");
      const timeToArr = app.timeTo.split("T")[1].split(":");
      return generateTimeSlots(
        new Date(selectedDate),
        Number(timeFromArr[0]) + (timeFromArr[1] == "30" ? 0.5 : 0),
        Number(timeToArr[0]) + (timeToArr[1] == "30" ? 0.5 : 0)
      );
    });

    return todaysSlots.filter(
      (slot) => !takenSlots.flat().find((taken) => taken === slot)
    );
  }, [dateTimeSlots, selectedDate, appointments]);

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4 font-mono">
        <NavBar active="booking" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="booking" />
          <div className="my-4 w-full sm:w-3/5">
            <div className={`date-time-picker-container`}>
              <DatePicker
                selectedDate={selectedDate}
                dateTimeSlots={dateTimeSlots}
                onChangeDate={onChangeDate}
              />
              <TimePicker
                selectedDate={selectedDate}
                timeSlots={memoedTimeSlots}
                onChangeTime={onChangeTime}
              />
            </div>
            <Form method="post">
              <input type="hidden" name="date" value={selectedDate} />
              <input type="hidden" name="timeFrom" value={selectedTime.start} />
              <input type="hidden" name="timeTo" value={selectedTime.end} />
              <button
                type="submit"
                className="w-full bg-stone-800 py-3 px-4 text-stone-100 hover:bg-stone-700 focus:bg-stone-500"
              >
                забукати
              </button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
