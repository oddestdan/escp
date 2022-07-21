import { businessHoursStart, businessHoursEnd } from "./constants";
import { getDateFormat, getDayOfWeek } from "./date";

const timeStart = Number(businessHoursStart.split(":")[0]) - 3; // 7
const timeEnd = Number(businessHoursEnd.split(":")[0]) - 3; // 21

export const generateHalfArrayRange = (from = timeStart, to = timeEnd) => {
  const arr = [];
  let start = from;
  for (; start < to; start += 0.5) {
    arr.push(start);
  }
  return arr;
};

export const generateTimeSlots = (
  day = new Date(),
  from = timeStart,
  to = timeEnd
) => {
  return generateHalfArrayRange(from, to).map(
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

  return getDaysArray(fromDate, toDate).map((day) => {
    return {
      date: day.toISOString().split("T")[0],
      isValid: day.getTime() > new Date().getTime(),
      dayOfWeek: getDayOfWeek(day),
      availableTimeSlots: generateTimeSlots(day),
    };
  });
};
