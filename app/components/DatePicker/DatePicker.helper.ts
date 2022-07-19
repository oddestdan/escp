import type { DateSlot } from "~/store/bookingSlice";

const defaultTime = "T00:00:00";

// Gets the difference between two dates
export const dateDiffInDays = (date1: Date, date2: Date): number => {
  const PER_DAY = 1000 * 60 * 60 * 24;
  const requiredDateDifference = Math.ceil(
    Math.abs(Number(date2) - Number(date1)) / PER_DAY
  );
  return requiredDateDifference - (requiredDateDifference % 7);
};

// Formats the date to number between 1-31
export const getDate = (date: string): number => {
  const dateFormat = new Date(`${date}${defaultTime}`);
  return dateFormat.getDate();
};

// Calculates the index of active slide in date picker slider
export const getActiveSlideIndex = (
  dateTimeSlots: Array<DateSlot>,
  selectedDate: string
): number => {
  if (dateTimeSlots?.length && selectedDate?.length) {
    return dateDiffInDays(
      new Date(`${dateTimeSlots[0].date}${defaultTime}`),
      new Date(`${selectedDate}${defaultTime}`)
    );
  }
  return 0;
};

export const getWeekDayFormat = (date: string): string => {
  return new Date(`${date}${defaultTime}`)
    .toLocaleString("uk", { weekday: "short" })
    .toLocaleLowerCase()
    .slice(0, 3);
};

export const getWeekDayMobileFormat = (date: string): string => {
  return new Date(`${date}${defaultTime}`)
    .toLocaleString("uk", { weekday: "short" })
    .toLocaleLowerCase()
    .charAt(0);
};
