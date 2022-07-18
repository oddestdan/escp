import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import DatePicker from "~/components/DatePicker/DatePicker";
import TimePicker from "~/components/TimePicker/TimePicker";
import Header from "~/header";
import {
  createAppointment,
  getAppointments,
} from "~/models/appointment.server";
import NavBar from "~/navbar";
import type { BookingState } from "~/store/bookingSlice";
import { saveTime, saveDate, fetchDateTimeSlots } from "~/store/bookingSlice";

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

export default function AdminBooking() {
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

  useEffect(() => {
    dispatch(fetchDateTimeSlots());
  }, [dispatch]);

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4 font-mono">
        <NavBar active="booking" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="booking" />
          <div className="my-4 sm:w-3/5">
            <div className={`date-time-picker-container`}>
              <DatePicker
                selectedDate={selectedDate}
                dateTimeSlots={dateTimeSlots}
                onChangeDate={onChangeDate}
              />
              <TimePicker
                selectedDate={selectedDate}
                timeSlots={
                  dateTimeSlots.find(({ date }) => date === selectedDate)
                    ?.availableTimeSlotList || []
                }
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
