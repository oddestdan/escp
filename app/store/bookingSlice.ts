import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  addMonths,
  getDateFormat,
  getPrevMonday,
  getTomorrow,
} from "~/utils/date";
import { generateDateTimeSlots } from "~/utils/slots";

export interface StoreBooking {
  booking: BookingState;
}

export enum BookingStep {
  DateTime,
  Services,
  ContactInfo,
  Payment,
  Confirmation,
}

export enum BookingService {
  assistance = "допомога",
  // TODO: create (i) info popup for additional information description
  additional = "інше",
}
export const bookingServicesList = [
  BookingService.assistance,
  BookingService.additional,
];

export interface ContactInfo {
  firstName: string;
  lastName: string;
  tel: string;
  socialMedia?: string;
}

export interface DateSlot {
  date: string;
  isValid: boolean;
  dayOfWeek: string;
  availableTimeSlots?: string[];
}

export interface DateTime {
  date: string;
  time: { start: string; end: string; diff: number };
  slots: DateSlot[];
}

type CustomizableBookingService = BookingService | string;
export interface BookingState {
  contact: ContactInfo;
  dateTime: DateTime;
  services: CustomizableBookingService[];
  currentStep: BookingStep;
}

const get3MonthSlots = () => {
  const fromDate = getPrevMonday();
  const toDate = addMonths(fromDate, 3);

  return generateDateTimeSlots(getDateFormat(fromDate), getDateFormat(toDate));
};

export const initialState: BookingState = {
  contact: {
    firstName: "",
    lastName: "",
    tel: "",
    socialMedia: "",
  },
  dateTime: {
    slots: get3MonthSlots(),
    date: getDateFormat(getTomorrow()),
    time: { start: "", end: "", diff: 0 },
  },
  services: [],
  currentStep: BookingStep.DateTime,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearAll(state: BookingState) {
      state.contact = { ...initialState.contact };
      state.dateTime = { ...initialState.dateTime };
      state.services = initialState.services;
      state.currentStep = initialState.currentStep;
    },
    saveCurrentStep(state: BookingState, action: PayloadAction<BookingStep>) {
      state.currentStep = action.payload;
    },
    saveDate(state: BookingState, action: PayloadAction<string>) {
      state.dateTime = { ...state.dateTime, date: action.payload };
    },
    saveTime(
      state: BookingState,
      action: PayloadAction<{ start: string; end: string; diff: number }>
    ) {
      state.dateTime = { ...state.dateTime, time: action.payload };
    },
    saveServices(
      state: BookingState,
      action: PayloadAction<CustomizableBookingService[]>
    ) {
      state.services = action.payload;
    },
    saveContactInfo(state: BookingState, action: PayloadAction<ContactInfo>) {
      state.contact = action.payload;
    },
  },
});

export const {
  clearAll,
  saveCurrentStep,
  saveDate,
  saveTime,
  saveServices,
  saveContactInfo,
} = bookingSlice.actions;
export default bookingSlice.reducer;
