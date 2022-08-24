import type {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventRemoveArg,
} from "@fullcalendar/react";

import React, { useRef } from "react";
import {
  businessHoursEnd,
  businessHoursStart,
  defaultEventTitle,
} from "~/utils/constants";
import { getDateFormat, getLocaleTime } from "~/utils/date";

import FullCalendar from "@fullcalendar/react"; // !!! must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export interface AdminCalendarEvent {
  title: string;
  start: string;
  end: string;
  id: string;
  description?: string;
}

export interface AdminCalendarProps {
  isMobile: boolean;
  events: AdminCalendarEvent[];
  createEvent: (event: Omit<AdminCalendarEvent, "id">) => void;
  changeEvent: (event: AdminCalendarEvent) => void;
  removeEvent: (eventId: string) => void;
}

const prettyFormatDate = (start: Date | null, end: Date | null) => {
  if (!start || !end) {
    return;
  }
  return `${getDateFormat(start)} -- ${getLocaleTime(start)} - ${getLocaleTime(
    end
  )}`;
};

const formatFullAppointment = ({
  title,
  start,
  end,
  id,
  description,
}: AdminCalendarEvent) => {
  return `ІВЕНТ #${id}\nАвтор: ${title}\nСервіси: ${description}\nДата та час: ${prettyFormatDate(
    new Date(start),
    new Date(end)
  )}`;
};

const AdminCalendar: React.FC<AdminCalendarProps> = ({
  events,
  createEvent,
  removeEvent,
  changeEvent,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  const onSelect = (data: DateSelectArg) => {
    const { start, end } = data;
    const result = prompt(
      `${prettyFormatDate(start, end)} назва івенту:`,
      defaultEventTitle
    );

    calendarRef.current?.getApi().unselect(); // clear date selection

    if (!result) {
      return;
    }

    const eventPayload = {
      start: start.toISOString(),
      end: end.toISOString(),
      title: result || defaultEventTitle,
    };
    createEvent(eventPayload);
  };

  // remove appointment OR view appointment info
  const onEventClick = (data: EventClickArg) => {
    const { title, id } = data.event;
    if (confirm(`Удалити івент? "OK" - УДАЛИТИ | "Cancel" - ПЕРЕГЛЯНУТИ `)) {
      if (!id) {
        alert(`Не можна вдалити івент ${title}`);
        return;
      }
      removeEvent(id);
      data.event.remove();
    } else {
      const fullAppointment = events.find((event) => event.id === id);
      fullAppointment && alert(formatFullAppointment(fullAppointment));
    }
  };

  // change appointment date & time
  const onEventChange = (data: EventChangeArg) => {
    const { title, start, end, id } = data.event;
    changeEvent({
      id,
      start: start!.toISOString(),
      end: end!.toISOString(),
      title,
    });
  };

  const onEventRemove = (data: EventRemoveArg) => {
    const { title, start, end } = data.event;
    alert(`Івент видалений: ${title}\n${prettyFormatDate(start, end)}`);
  };

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      height={"80vh"}
      selectable={true}
      editable={true}
      weekends={true}
      navLinks={true}
      nowIndicator={true}
      firstDay={1} // 0 = Sunday, 1 = Monday
      dayMaxEvents={true} // when too many events in a day, show the popover
      businessHours={{
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startTime: businessHoursStart,
        endTime: businessHoursEnd,
      }}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }} // buttons for switching between views
      initialView="timeGridWeek"
      select={onSelect}
      eventClick={onEventClick}
      eventChange={onEventChange}
      eventRemove={onEventRemove}
      eventsSet={console.log}
      // initialEvents={[...events]}
      eventSources={[{ events }]}
    />
  );
};

export default AdminCalendar;
