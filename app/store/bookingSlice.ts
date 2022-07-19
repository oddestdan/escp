import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { addMonths, getDateFormat, getPrevMonday } from "~/utils/date";
import { generateDateTimeSlots } from "~/utils/slots";

export enum BookingStep {
  DateTime,
  Services,
  Contact,
  Payment,
  Confirmation,
}

export interface DateSlot {
  date: string;
  dayOfWeek: string;
  availableTimeSlots?: string[];
}

export interface DateTime {
  date: string;
  time: { start: string; end: string };
  slots: DateSlot[];
}

export interface BookingState {
  contact: number | null;
  dateTime: DateTime;
  services: number | null;
  currentStep: BookingStep;
}

const get3MonthSlots = () => {
  const fromDate = getPrevMonday();
  const toDate = addMonths(fromDate, 3);

  return generateDateTimeSlots(getDateFormat(fromDate), getDateFormat(toDate));
};

export const initialState: BookingState = {
  contact: null,
  dateTime: {
    slots: get3MonthSlots(),
    date: getDateFormat(),
    time: { start: "", end: "" },
  },
  services: null,
  currentStep: BookingStep.DateTime,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    saveDate(state: BookingState, action: PayloadAction<string>) {
      state.dateTime = { ...state.dateTime, date: action.payload };
    },
    saveTime(
      state: BookingState,
      action: PayloadAction<{ start: string; end: string }>
    ) {
      state.dateTime = { ...state.dateTime, time: action.payload };
    },
  },
});

export const { saveDate, saveTime } = bookingSlice.actions;
export default bookingSlice.reducer;
