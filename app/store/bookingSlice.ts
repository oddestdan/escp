import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { START_FROM_MONDAY } from "~/utils/constants";
import { addMonths, getDateFormat, getPrevMonday } from "~/utils/date";
import { generateDateTimeSlots } from "~/utils/slots";
import { studiosData } from "~/utils/studiosData";

export const IS_DEV = false;
export const IS_POST_CREATION_FLOW = false;
export const BOOKING_UNDER_MAINTENANCE = true;
export const ENABLE_OVERLAPS = false;

export interface StoreBooking {
  booking: BookingState;
}

export enum BookingStep {
  Studio,
  DateTime,
  Services,
  ContactInfo,
  Payment,
  Confirmation,
}

export const bookingStepsDisplayData = [
  { title: "зал", icon: "з" },
  { title: "час", icon: "ч" },
  { title: "сервіси", icon: "с" },
  { title: "інфо", icon: "і" },
  { title: "оплата", icon: "o" },
];

export enum BookingService {
  // assistance = "асистент",
  instax = `instax (300 грн)`,
  instaxCartridged = "instax з картриджами (800 грн)",
  parking = "паркомісце",
  elevator = "вантажний ліфт",
  extra = "інше",
}
export interface AdditionalServices {
  // assistance?: number;
  instax?: string;
  instaxCartridged?: string;
  parking?: string;
  elevator?: string;
  extra?: string;
}

export const bookingServicesList = [
  // BookingService.assistance,
  // BookingService.instax,
  // BookingService.instaxCartridged,
  BookingService.parking,
  BookingService.elevator,
  BookingService.extra,
];

export interface ContactInfo {
  firstName: string;
  lastName?: string;
  tel: string;
  socialMedia?: string;
}

export interface DateSlot {
  date: string;
  isValid: boolean;
  dayOfWeek: string;
  availableTimeSlots?: string[];
}

export interface TimeState {
  start: string;
  end: string;
  diff: number;
}

export interface DateTime {
  date: string;
  time: TimeState;
  slots: DateSlot[];
  hasWeekChanged: boolean;
}

type CustomizableBookingService = BookingService | string;

export interface TotalPrice {
  booking: number;
  services?: number;
}

export interface BookingState {
  studio: StudioInfo;
  contact: ContactInfo;
  dateTime: DateTime;
  services: CustomizableBookingService[]; // static string[] services, currently empty
  additionalServices: AdditionalServices;
  currentStep: BookingStep;
  maxStepVisited: BookingStep;
  price: TotalPrice;
  errorMessage: string;
}

const get3MonthSlots = () => {
  // const fromDate = START_FROM_MONDAY ? getPrevMonday() : getCleanDate();
  const fromDate = START_FROM_MONDAY ? getPrevMonday() : new Date();
  const toDate = addMonths(fromDate, 3);

  return generateDateTimeSlots(getDateFormat(fromDate), getDateFormat(toDate));
};

export const initialState: BookingState = {
  studio: studiosData?.[0],
  contact: {
    firstName: IS_DEV ? "Dan" : "",
    lastName: IS_DEV ? "Developer" : "",
    tel: IS_DEV ? "+380983308847" : "",
    socialMedia: "",
  },
  dateTime: {
    slots: get3MonthSlots(),
    date: getDateFormat(),
    time: { start: "", end: "", diff: 0 },
    // time: IS_DEV
    //   ? {
    //       start: `${getDateFormat()}T09:00:00.000Z`,
    //       end: `${getDateFormat()}T12:00:00.000Z`,
    //       diff: 3,
    //     }
    //   : { start: "", end: "", diff: 0 },
    hasWeekChanged: false,
  },
  services: [],
  additionalServices: {},
  currentStep: BookingStep.Studio,
  // currentStep: IS_DEV ? BookingStep.Payment : BookingStep.Studio,
  maxStepVisited: BookingStep.Studio,
  // maxStepVisited: IS_DEV ? BookingStep.Payment : BookingStep.Studio,
  price: {
    booking: IS_DEV ? 1 : 0,
    services: 0,
  },

  errorMessage: "",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearAll(state: BookingState) {
      state.studio = { ...initialState.studio };
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
    saveStudio(state: BookingState, action: PayloadAction<number>) {
      state.studio = studiosData[action.payload];
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
    setHasWeekChanged(state: BookingState, action: PayloadAction<boolean>) {
      state.dateTime = { ...state.dateTime, hasWeekChanged: action.payload };
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

    setErrorMessage(state: BookingState, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
  },
});

export const {
  clearAll,
  saveCurrentStep,
  saveStudio,
  saveDate,
  saveTime,
  setHasWeekChanged,
  saveTotalPrice,
  saveServices,
  saveAdditionalServices,
  saveContactInfo,
  setErrorMessage,
} = bookingSlice.actions;
export default bookingSlice.reducer;
