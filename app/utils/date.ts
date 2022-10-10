export const getPrevMonday = () => {
  const prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday;
};

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export const addMonths = (date = new Date(), numOfMonths: number) => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);
  return dateCopy;
};

export const getDayOfWeek = (date: Date = new Date()) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const getLocaleTime = (date: Date = new Date()) => {
  return date.toLocaleTimeString("uk", {
    hour: "numeric",
    minute: "numeric",
  });
};

export const getDateFormat = (date: Date = new Date()) => {
  return date.toISOString().split("T")[0];
};

const getUnpaddedTimeFormat = (time: string): string => {
  return time.charAt(0) === "0" ? time.slice(1) : time;
};

export const formatTimeSlot = (time: string) => {
  return getUnpaddedTimeFormat(getLocaleTime(new Date(time)));
};

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
