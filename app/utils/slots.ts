import { businessHoursStart, businessHoursEnd } from "./constants";
import { getDateFormat, getDayOfWeek, getTomorrow } from "./date";

const timeStart = Number(businessHoursStart.split(":")[0]) - 3; // 7
const timeEnd = Number(businessHoursEnd.split(":")[0]) - 3; // 21

export const generateArrayRangeWithStep = (
  from = timeStart,
  to = timeEnd,
  step = 1 // can also be half-hourly by using step === 0.5
) => {
  const arr = [];
  let start = from;
  for (; start < to; start += step) {
    arr.push(start);
  }
  return arr;
};

export const generateTimeSlots = (
  day = new Date(),
  from = timeStart,
  to = timeEnd
) => {
  return generateArrayRangeWithStep(from, to).map(
    (k) =>
      `${getDateFormat(day)}T${`${Math.floor(k)}`.padStart(2, "0")}:${
        k % 1 === 0 ? "00" : "30"
      }:00.000Z`
  );
};

export const generateDateTimeSlots = (fromDate: string, toDate: string) => {
  const getDaysArray = function (start: string, end: string) {
    const arr = [];
    for (
      const date = new Date(start);
      date <= new Date(end);
      date.setDate(date.getDate() + 1)
    ) {
      arr.push(new Date(date));
    }
    return arr;
  };

  const tomorrow = getDateFormat(getTomorrow());

  return getDaysArray(fromDate, toDate).map((day) => {
    const date = getDateFormat(day);
    if (date === tomorrow) {
      console.log("> check tomorrow...");
      console.log(date, tomorrow, date >= tomorrow);
    }
    return {
      date,
      isValid: date >= tomorrow,
      dayOfWeek: getDayOfWeek(day),
      availableTimeSlots: generateTimeSlots(day),
    };
  });
};
