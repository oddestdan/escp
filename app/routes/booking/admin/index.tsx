import { useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "@remix-run/server-runtime";
import {
  confirmAppointment,
  createAppointment,
} from "~/models/appointment.server";
import { updateAppointment } from "~/models/appointment.server";
import { deleteAppointment } from "~/models/appointment.server";
import AdminCalendar, {
  formatFullAppointment,
} from "~/components/AdminCalendar/AdminCalendar";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { getAppointments } from "~/models/appointment.server";
import invariant from "tiny-invariant";
import { getIsMobile } from "~/utils/breakpoints";
import { requireUserId } from "~/session.server";
import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";

import type { AdminCalendarEvent } from "~/components/AdminCalendar/AdminCalendar";
import type { ActionFunction } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import type {
  AdditionalServices,
  BookingService,
  ContactInfo,
} from "~/store/bookingSlice";

type LoaderData = {
  appointments: Appointment[];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const method = request.method;

  switch (method) {
    case "POST": {
      // Create
      const timeFrom = formData.get("startTime");
      const timeTo = formData.get("endTime");
      const date = formData.get("date");

      invariant(typeof timeFrom === "string", "timeFrom must be a string");
      invariant(typeof timeTo === "string", "timeTo must be a string");
      invariant(typeof date === "string", "date must be a string");
      return await createAppointment({
        timeFrom,
        timeTo,
        date,
        services: "[]",
        contactInfo: "{}",
        price: "0",
      });
    }
    case "PUT": {
      // Change
      const id = formData.get("appointmentId");
      const timeFrom = formData.get("startTime");
      const timeTo = formData.get("endTime");
      const date = formData.get("date");

      invariant(typeof timeFrom === "string", "timeFrom must be a string");
      invariant(typeof timeTo === "string", "timeTo must be a string");
      invariant(typeof date === "string", "date must be a string");
      invariant(typeof id === "string", "appointmentId must be a string");
      return await updateAppointment({ timeFrom, timeTo, date, id });
    }
    case "PATCH": {
      // Confirm
      const id = formData.get("appointmentId");
      const confirmed = formData.get("confirmed") === "true";
      invariant(typeof id === "string", "appointmentId must be a string");
      invariant(typeof confirmed === "boolean", "confirmed must be a boolean");

      return await confirmAppointment(id, confirmed);
    }
    case "DELETE": {
      // Remove
      const appointmentId = formData.get("appointmentId");

      invariant(
        typeof appointmentId === "string",
        "appointmentId must be a string"
      );

      return await deleteAppointment(appointmentId);
    }
    default:
      return null;
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const appointments = await getAppointments();
  if (!userId) {
    return redirect("/login");
  }
  if (!appointments) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ appointments });
};

export default function AdminBooking() {
  const { appointments } = useLoaderData() as LoaderData;
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminCalendarEvent>();

  console.log("appointments loaded:");
  console.log(appointments);

  const onCreateAppointment = useCallback(
    (event: Omit<AdminCalendarEvent, "id">) => {
      const formData = new FormData(formRef.current || undefined);
      formData.set("startTime", event.start);
      formData.set("endTime", event.end);
      formData.set("date", event.start.split("T")[0]);
      submit(formData, { method: "post" });
    },
    [submit]
  );

  const onChangeAppointment = useCallback(
    (event: AdminCalendarEvent) => {
      const formData = new FormData(formRef.current || undefined);
      formData.set("startTime", event.start);
      formData.set("endTime", event.end);
      formData.set("date", event.start.split("T")[0]);
      formData.set("appointmentId", event.id);
      submit(formData, { method: "put" });
    },
    [submit]
  );

  const onConfirmAppointment = useCallback(() => {
    if (!selectedAppointment || !selectedAppointment.id) {
      alert("Нема що підтвердити, невірна бронь");
      return;
    }

    const { id: eventId, confirmed: wasConfirmed } = selectedAppointment;

    const formData = new FormData(formRef.current || undefined);
    formData.set("appointmentId", eventId);
    formData.set("confirmed", wasConfirmed ? "false" : "true");
    submit(formData, { method: "patch" });

    alert(
      `${wasConfirmed ? "Скасовано" : "Підтверджено"} бронювання ${eventId}`
    );
  }, [selectedAppointment, submit]);

  const onRemoveAppointment = useCallback(() => {
    if (!selectedAppointment) {
      alert(`Не можна видалити бронювання`);
      return;
    }

    const eventId = selectedAppointment?.id;
    const formData = new FormData(formRef.current || undefined);
    formData.set("appointmentId", eventId);
    submit(formData, { method: "delete" });

    alert(`Видалено бронювання ${eventId}`);
  }, [submit, selectedAppointment]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  const getAppointmentTitle = (appointment: Appointment): string => {
    const info: ContactInfo = JSON.parse(appointment.contactInfo);

    if (!info.firstName || !info.tel) {
      return "Incognito";
    }

    return `${info.firstName} ${info.lastName ? info.lastName[0] + "." : ""}, ${
      info.tel
    }`;
  };

  const getAppointmentDescription = (description: {
    services: BookingService[];
    additionalServices: AdditionalServices;
  }) => {
    if (!description.additionalServices) {
      return "--";
    }

    const {
      // services: _,
      additionalServices: { assistance, extra },
    } = description;

    return (
      [
        `${assistance ? `ассистент: ${assistance} год` : ""}`,
        `${extra ? `додатково: "${extra}"` : ""}`,
      ]
        .filter((x) => x.length)
        .join(" | ") || "--"
    );
  };

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4 font-mono">
        <NavBar active="admin" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="admin" />
          <div className="my-4 sm:w-4/5">
            <Form ref={formRef} method="post">
              <AdminCalendar
                isMobile={isMobile}
                events={appointments.map((app) => {
                  const isSelected = app.id === selectedAppointment?.id;
                  return {
                    id: app.id,
                    start: app.timeFrom,
                    end: app.timeTo,
                    description: getAppointmentDescription(
                      JSON.parse(app.services)
                    ),
                    title: `${getAppointmentTitle(app)}`,
                    allDay: !app.timeFrom?.length || !app.timeTo?.length,
                    backgroundColor: app.confirmed
                      ? isSelected
                        ? "mediumblue"
                        : "royalblue"
                      : isSelected
                      ? "dimgrey"
                      : "grey",
                    confirmed: app.confirmed,
                    borderColor:
                      app.id === selectedAppointment?.id
                        ? "red"
                        : "transparent",
                  };
                })}
                createEvent={onCreateAppointment}
                changeEvent={onChangeAppointment}
                selectEvent={setSelectedAppointment}
              />
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 p-2 text-white"
                onClick={onConfirmAppointment}
              >
                {selectedAppointment?.confirmed ? "Скасувати" : "Підтвердити"}
              </button>
              <button
                type="button"
                className="mt-4 ml-4 rounded-md bg-red-500 p-2 text-white"
                onClick={() => onRemoveAppointment()}
              >
                Видалити
              </button>
            </Form>

            <h4 className="mt-4 mb-2 font-medium">Обране бронювання:</h4>
            <pre>
              {selectedAppointment
                ? formatFullAppointment(selectedAppointment)
                : "--"}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
