import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { mockDateSlots } from "~/components/DatePicker/mockDateSlots";

export enum BookingStep {
  DateTime,
  Services,
  Contact,
  Payment,
  Confirmation,
}

export interface DateTime {
  date: string;
  time: { start: string; end: string };
  slots: Array<any>;
}

export interface BookingState {
  contact: number | null;
  dateTime: DateTime;
  services: number | null;
  currentStep: BookingStep;
}

export const initialState: BookingState = {
  contact: null,
  dateTime: {
    slots: [],
    date: "2022-07-15", // TODO: get from todays date after BE complete
    time: { start: "", end: "" },
    // time: { start: "2022-07-15T09:30:00", end: "2022-07-15T10:00:00" },
    // and we aren't using mocks, instead live data is sent from DB
  },
  services: null,
  currentStep: BookingStep.DateTime,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    fetchDateTimeSlots(state: BookingState) {
      state.dateTime = { ...state.dateTime, slots: mockDateSlots };
    },
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

export const { fetchDateTimeSlots, saveDate, saveTime } = bookingSlice.actions;
export default bookingSlice.reducer;
