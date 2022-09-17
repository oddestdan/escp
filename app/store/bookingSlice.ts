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
  assistance = "допомога асистента",
  // TODO: create (i) info popup for extra information description
  extra = "інше",
}
export interface AdditionalServices {
  assistance?: number;
  extra?: string;
}

export const bookingServicesList = [
  BookingService.assistance,
  BookingService.extra,
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

export interface TotalPrice {
  booking: number;
  services?: number;
}

export interface BookingState {
  contact: ContactInfo;
  dateTime: DateTime;
  services: CustomizableBookingService[]; // static string[] services, currently empty
  additionalServices: AdditionalServices;
  currentStep: BookingStep;
  maxStepVisited: BookingStep;
  price: TotalPrice;
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
  additionalServices: {},
  currentStep: BookingStep.DateTime,
  maxStepVisited: BookingStep.DateTime,
  price: {
    booking: 0,
    services: 0,
  },
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
      if (state.maxStepVisited < action.payload) {
        state.maxStepVisited = action.payload;
      }
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
    saveTotalPrice(state: BookingState, action: PayloadAction<TotalPrice>) {
      state.price = action.payload;
    },
    saveServices(
      state: BookingState,
      action: PayloadAction<CustomizableBookingService[]>
    ) {
      state.services = action.payload;
    },
    saveAdditionalServices(
      state: BookingState,
      action: PayloadAction<AdditionalServices>
    ) {
      state.additionalServices = action.payload;
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
  saveTotalPrice,
  saveServices,
  saveAdditionalServices,
  saveContactInfo,
} = bookingSlice.actions;
export default bookingSlice.reducer;
