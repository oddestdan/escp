import type { ActionFunction } from "@remix-run/node";
import type { AdminCalendarEvent } from "~/components/AdminCalendar/AdminCalendar";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import { createAppointment } from "~/models/appointment.server";
import { updateAppointment } from "~/models/appointment.server";
import { deleteAppointment } from "~/models/appointment.server";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminCalendar from "~/components/AdminCalendar/AdminCalendar";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { getAppointments } from "~/models/appointment.server";
import invariant from "tiny-invariant";
import { getIsMobile } from "~/utils/breakpoints";
import { requireUserId } from "~/session.server";
import { NavBar } from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";

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

  const onRemoveAppointment = useCallback(
    (eventId: string) => {
      const formData = new FormData(formRef.current || undefined);
      formData.set("appointmentId", eventId);
      submit(formData, { method: "delete" });
    },
    [submit]
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

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
                events={appointments.map((app, i) => ({
                  id: app.id,
                  start: app.timeFrom,
                  end: app.timeTo,
                  description: `Test description ${app.id} #${i}`,
                  // TODO: contact firstName and 1st letter of lastName
                  // e.g.: Marina K
                  title: app.id,
                }))}
                createEvent={onCreateAppointment}
                changeEvent={onChangeAppointment}
                removeEvent={onRemoveAppointment}
              />
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
