import { START_FROM_MONDAY } from "./constants";

export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export const defaultTime = "T00:00:00";

// Formats the date to number between 1-31
export const getDateNumber = (date: string): number => {
  const dateFormat = new Date(`${date}${defaultTime}`);
  return dateFormat.getDate();
};

export const getWeekDayFormat = (date: string): string => {
  return new Date(`${date}${defaultTime}`)
    .toLocaleString("uk", { weekday: "short" })
    .toLocaleLowerCase()
    .slice(0, 3);
};

export const getPrevMonday = (date = new Date()) => {
  const prevMonday = date;
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday;
};

export const getCleanDate = (date = new Date()) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getTomorrow = (tomorrow = new Date()) => {
  tomorrow.setDate(tomorrow.getDate() + 1);
  // return getCleanDate(tomorrow); // buggy due to time zones
  return tomorrow;
};

export const getYesterday = (yesterday = new Date()) => {
  yesterday.setDate(yesterday.getDate() - 1);
  // return getCleanDate(yesterday);
  return yesterday;
};

export const addDays = (date = new Date(), numOfDays: number): Date => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setDate(dateCopy.getDate() + numOfDays);
  return dateCopy;
};

export const addMonths = (date = new Date(), numOfMonths: number) => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);
  return dateCopy;
};

export const getDayOfWeek = (date: Date = new Date()) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const daysIntoYear = (date: Date = new Date()) => {
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000
  );
};

export const getDayOfWeekNumbered = (date: Date = new Date()) => {
  if (START_FROM_MONDAY) {
    return (date.getDay() - 1 + 7) % 7;
  }

  const xInYear = daysIntoYear(date);
  const todayInYear = daysIntoYear(new Date());

  return (xInYear - todayInYear) % 7;
};

export const getWeekDates = (dateString: string): Date[] => {
  return Array.from(Array(7).keys()).map((idx) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() - ((d.getDay() - 1 + 7) % 7) + idx);
    return d;
  });
};

export const getNextWeekFromToday = (dateString: string): Date[] => {
  const todayDay = (new Date().getDay() - 1 + 7) % 7;
  return Array.from(Array(7).keys()).map((idx) => {
    const d = new Date(dateString);
    d.setHours(12); // hack to eliminate winter/summer time switches
    d.setDate(d.getDate() - ((d.getDay() - 1 + 14 - todayDay) % 7) + idx);
    return d;
  });
};

export const getLocaleTime = (date: Date = new Date()) => {
  return date.toLocaleTimeString("uk", {
    hour: "numeric",
    minute: "numeric",
  });
};

export const getDateFormat = (date: Date = new Date(), timeZone?: number) => {
  // Today is +3 hrs from 0
  // const dateISO = addMinutes(date.toISOString(), 3 * 60);
  date.setHours(12); // hack to eliminate winter/summer time switches
  const dateISO = date.toISOString();
  return dateISO.split("T")[0];
};

const getUnpaddedTimeFormat = (time: string): string => {
  return time.charAt(0) === "0" ? time.slice(1) : time;
};

export const formatTimeSlot = (time: string) => {
  return getUnpaddedTimeFormat(getLocaleTime(new Date(time)));
};

export const formatShortTimeSlot = (time: string) => {
  return getLocaleTime(new Date(time)).split(":")[0];
};

export const formatLocaleDate = (locale: string, dateString: string) => {
  return new Date(dateString)
    .toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .slice(0, -3);
};

export const getMyTZOffset = (date: Date) => date.getTimezoneOffset() / -60;

// const tzOffset = new Date().getTimezoneOffset() * 60000;
export const addMinutes = (time: string, minutes: number) => {
  const minutesOffset = minutes * 60000;
  if (!time) return time;
  return new Date(
    // new Date(time).getTime() - tzOffset + minutesOffset
    new Date(time).getTime() + minutesOffset
  ).toISOString();
};

export const formatCalculatedTimePeriod = (diff: number, isMobile = false) => {
  const hour = Math.floor(diff);

  if (isMobile) {
    return (
      (hour > 0 ? `${hour} год.` : "") + (diff % 1 === 0.5 ? " 30 хв." : "")
    );
  }

  const wordingMinute = diff % 1 === 0.5 ? " 30 хвилин" : "";
  let wordingHour = hour > 0 ? `${hour} година` : ``;
  wordingHour = hour > 1 ? `${hour} години` : wordingHour;
  wordingHour = hour > 4 ? `${hour} годин` : wordingHour;

  return wordingHour + wordingMinute;
};

export const generateDateTimeSlotsISO = (date: string) => {
  return new Array(24).fill(1).map((_, i) => {
    return new Date(date)
      .toISOString()
      .replace(/T\d*/, "T" + `${i}`.padStart(2, "0"));
  });
};

export const fromRFC3339ToISO = (rfcDate: string) => {
  return new Date(Date.parse(rfcDate)).toISOString();

  // const someDateNumber = Date.parse(rfcDate);
  // const offsetTZ = new Date(someDateNumber).getTimezoneOffset() * 60000; // offset in milliseconds
  // const localISOTime = new Date(someDateNumber - offsetTZ).toISOString();
  // return localISOTime;
};

export const fromISOToRFC3339 = (isoDate: string) =>
  isoDate.slice(0, -5) + "+00:00";
// "+" +
// `${getMyTZOffset(new Date(isoDate))}`.padStart(2, "0") +
// ":00";

export const getHoursDiffBetweenDates = (dateA: Date, dateB: Date) =>
  Math.abs(dateA.getTime() - dateB.getTime()) / 3.6e6; // 60 * 60 * 1000
