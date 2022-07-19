export const getPrevMonday = () => {
  const prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday;
};

export const addMonths = (date = new Date(), numOfMonths: number) => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);
  return dateCopy;
};

export const getDayOfWeek = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const getDateFormat = (date: Date = new Date()) => {
  return date.toISOString().split("T")[0];
};

const getUnpaddedTimeFormat = (time: string): string => {
  return time.charAt(0) === "0" ? time.slice(1) : time;
};

export const formatTimeSlot = (time: string) => {
  return getUnpaddedTimeFormat(
    new Date(time).toLocaleTimeString("uk", {
      hour: "numeric",
      minute: "numeric",
    })
  );
};

const tzOffset = new Date().getTimezoneOffset() * 60000;
export const addMinutes = (time: string, minutes: number) => {
  const minutesOffset = minutes * 60000;
  return new Date(new Date(time).getTime() - tzOffset + minutesOffset)
    .toISOString()
    .slice(0, -5);
};
