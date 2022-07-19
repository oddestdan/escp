import type {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventRemoveArg,
} from "@fullcalendar/react";

import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  businessHoursEnd,
  businessHoursStart,
  defaultEventTitle,
} from "~/utils/constants";

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
  return `from: ${start ? start.toString().split(" GMT")[0] : ""}\nto: ${
    end ? end.toString().split(" GMT")[0] : ""
  }\n`;
};

const AdminCalendar: React.FC<AdminCalendarProps> = ({
  events,
  createEvent,
  removeEvent,
  changeEvent,
}) => {
  console.log("AdminCalendar props/ events", events);
  const calendarRef = useRef<FullCalendar>(null);

  const onSelect = (data: DateSelectArg) => {
    const { start, end } = data;
    const result = prompt(
      `${prettyFormatDate(start, end)}event name:`,
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
    const { title, start, end, id } = data.event;
    if (confirm(`remove event? "OK" - remove | "Cancel" - view info `)) {
      if (!id) {
        alert(`can't remove appointment ${title} yet`);
        return;
      }
      removeEvent(id);
      data.event.remove();
    } else {
      alert(`appointment: ${title}\n${prettyFormatDate(start, end)}`);
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
    alert(`removed appointment: ${title}\n${prettyFormatDate(start, end)}`);
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
