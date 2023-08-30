import { businessHoursStart, businessHoursEnd } from "./constants";
import { getDateFormat, getDayOfWeek, getUAOffsetHours } from "./date";

type Slot = { timeFrom: string; timeTo: string };
export const slotOverlapsAnotherSlot = (slotA: Slot, slotB: Slot) => {
  const aStartOverlaps =
    slotA.timeFrom >= slotB.timeFrom && slotA.timeFrom < slotB.timeTo;
  const aEndOverlaps =
    slotA.timeTo > slotB.timeFrom && slotA.timeTo <= slotB.timeTo;

  const bStartOverlaps =
    slotB.timeFrom >= slotA.timeFrom && slotB.timeFrom < slotA.timeTo;
  const bEndOverlaps =
    slotB.timeTo > slotA.timeFrom && slotB.timeTo <= slotA.timeTo;

  return aStartOverlaps || aEndOverlaps || bStartOverlaps || bEndOverlaps;
};

export const generateArrayRangeWithStep = (from: number, to: number) => {
  const arr = [];
  const step = 1; // can also be half-hourly by using step === 0.5
  let start = from;
  for (; start < to; start += step) {
    arr.push(start);
  }
  return arr;
};

// returns time slots in default 0 timezone
export const generateTimeSlots = (
  day = new Date(),
  from = (((Number(businessHoursStart.split(":")[0]) - getUAOffsetHours(day)) %
    24) +
    24) %
    24,
  to = (((Number(businessHoursEnd.split(":")[0]) - getUAOffsetHours(day)) %
    24) +
    24) %
    24
  // from = Number(businessHoursStart.split(":")[0]) - getUAOffsetHours(),
  // to = Number(businessHoursEnd.split(":")[0]) - getUAOffsetHours()
) => {
  const slots = generateArrayRangeWithStep(from, to).map((k) => {
    return `${getDateFormat(day)}T${`${Math.floor(k)}`.padStart(2, "0")}:${
      k % 1 === 0 ? "00" : "30"
    }:00.000Z`;
  });
  return slots;
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

  const today = getDateFormat();

  const daySlots = getDaysArray(fromDate, toDate).map((day) => {
    const date = getDateFormat(day);

    return {
      date,
      isValid: date >= today,
      dayOfWeek: getDayOfWeek(day),
      availableTimeSlots: generateTimeSlots(day),
    };
  });

  return daySlots;
};
