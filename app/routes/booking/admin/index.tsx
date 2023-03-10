/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from "react";
import { redirect } from "@remix-run/server-runtime";
import {
  confirmAppointment,
  createAppointment,
} from "~/models/appointment.server";
import { updateAppointment } from "~/models/appointment.server";
import { deleteAppointment } from "~/models/appointment.server";
import { json } from "@remix-run/server-runtime";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { getAppointments } from "~/models/appointment.server";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import { BookingService } from "~/store/bookingSlice";
import { getDateFormat, getHoursDiffBetweenDates } from "~/utils/date";
import AdminCalendar, {
  prettyFormatDate,
} from "~/components/AdminCalendar/AdminCalendar";

import type { AdminCalendarEvent } from "~/components/AdminCalendar/AdminCalendar";
import type { ActionFunction } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import type { AdditionalServices, ContactInfo } from "~/store/bookingSlice";

// [active, non-active]
const confirmedColors = ["mediumblue", "royalblue"];
const defaultColors = ["dimgrey", "grey"];
const importedColors = ["darkorange", "orange"];

export const getAppointmentTitle = (
  info: ContactInfo,
  startDate: Date,
  endDate: Date,
  price: string
): string => {
  if (!info.firstName || !info.tel) {
    return "Incognito";
  }

  const duration = Math.abs(getHoursDiffBetweenDates(endDate, startDate));

  return `${duration} год, ${info.firstName}${
    info.lastName ? ` ${info.lastName[0]}.` : ""
  }, ${price}грн`;
};

export const getAppointmentDescription = (
  description: {
    services: BookingService[];
    additionalServices: AdditionalServices;
  },
  info: ContactInfo
) => {
  if (!description.additionalServices && !description.services) {
    return "--";
  }

  const {
    services,
    additionalServices: { assistance, extra },
  } = description;

  const regular = services.filter(
    (s) => s !== BookingService.assistance && s !== BookingService.extra
  );
  if (extra) regular.pop();

  return (
    [
      `${info.firstName}${info.lastName ? ` ${info.lastName}` : ""}`,
      info.tel,
      info.socialMedia || "",
      `${assistance ? `ассистент: ${assistance} год` : ""}`,
      ...regular,
      `${extra ? `додатково: "${extra}"` : ""}`,
    ]
      .filter((x) => x.length)
      .join("\n") || "-немає додаткової інформації-"
  );
};

const exportAppointmentData = (data: Appointment[], fileTitle: string) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${fileTitle}.json`;
  link.click();
};

export const formatFullAppointment = ({
  title,
  start,
  end,
  id,
  description,
  confirmed,
}: AdminCalendarEvent): string[] => {
  return [
    `Бронювання: ${id}`,
    `Підтверджено: ${confirmed ? "ТАК" : "НІ"}`,
    `Автор: ${title}`,
    `Сервіси: ${description}`,
    `Дата та час: ${prettyFormatDate(new Date(start), new Date(end))}`,
  ].filter(Boolean);
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
      const title = formData.get("title");

      invariant(typeof timeFrom === "string", "timeFrom must be a string");
      invariant(typeof timeTo === "string", "timeTo must be a string");
      invariant(typeof date === "string", "date must be a string");
      invariant(typeof title === "string", "title must be a string");

      // for imported appointments
      const contact = title.endsWith("imported")
        ? {
            tel: title.split(",")[0],
            firstName: title.substring(title.indexOf(",") + 1),
          }
        : { tel: "+380000000000", firstName: title };

      return await createAppointment({
        timeFrom,
        timeTo,
        date,
        services: "[]",
        contactInfo: JSON.stringify(contact),
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

type LoaderData = { appointments: Appointment[] };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const appointments = (await getAppointments()) as Appointment[];
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

  if (Boolean("admin not needed anymore") === true) {
    return (
      <div className="w-100 my-auto flex h-[100vh] flex-col justify-center text-center text-2xl">
        😉
        <br />
        тут нема на що дивитися
      </div>
    );
  }

  const toCalendarAppointment = useCallback(
    (app: Appointment) => {
      const title = getAppointmentTitle(
        JSON.parse(app.contactInfo),
        new Date(app.timeFrom),
        new Date(app.timeTo),
        app.price
      );
      const isSelected = app.id === selectedAppointment?.id;
      const isImported = title.endsWith("imported");

      return {
        id: app.id,
        start: app.timeFrom,
        end: app.timeTo,
        description: getAppointmentDescription(
          JSON.parse(app.services),
          JSON.parse(app.contactInfo)
        ),
        title,
        allDay: !app.timeFrom?.length || !app.timeTo?.length,
        backgroundColor: app.confirmed
          ? isSelected
            ? confirmedColors[0]
            : confirmedColors[1]
          : isImported
          ? isSelected
            ? importedColors[0]
            : importedColors[1]
          : isSelected
          ? defaultColors[0]
          : defaultColors[1],
        confirmed: app.confirmed,
        borderColor: isSelected ? "red" : "transparent",
      };
    },
    [selectedAppointment]
  );

  const onCreateAppointment = useCallback(
    (event: Omit<AdminCalendarEvent, "id">) => {
      const formData = new FormData(formRef.current || undefined);
      formData.set("startTime", event.start);
      formData.set("endTime", event.end);
      formData.set("date", event.start.split("T")[0]);
      formData.set("title", event.title);
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
    if (!selectedAppointment || !selectedAppointment.id) {
      alert(`Нема що видалити`);
      return;
    }

    const eventId = selectedAppointment.id;
    const formData = new FormData(formRef.current || undefined);
    formData.set("appointmentId", eventId);
    submit(formData, { method: "delete" });

    alert(`Видалено бронювання ${eventId}`);
  }, [submit, selectedAppointment]);

  const onExportAppointmentData = useCallback(() => {
    if (!selectedAppointment || !selectedAppointment.id) {
      alert(`Нема що експортувати`);
      return;
    }

    const appointment = appointments.find(
      (app) => app.id === selectedAppointment?.id
    );
    if (!appointment || !appointment.id) {
      alert(`Нема що експортувати`);
      return;
    }

    console.log("Exporting appointment data:");
    console.log(appointment);

    exportAppointmentData(
      [appointment],
      `escp-appointment-${selectedAppointment.id}_${getDateFormat()}`
    );
  }, [selectedAppointment, appointments]);

  const onExportAppointmentsData = useCallback(() => {
    console.log("Exporting appointments data:");
    console.log(appointments);

    exportAppointmentData(appointments, `escp-appointments_${getDateFormat()}`);
  }, [appointments]);

  const onImportAppointmentData = useCallback(
    (e) => {
      console.log("Importing appointments data:");

      if (!e.target.files || !e.target.files[0]) {
        return alert("Помилка про імпортуванні файлу!");
      }

      const importedFile = e.target.files[0];

      if (importedFile.type !== "application/json") {
        return alert("Невірний формат файлу!");
      }

      const fileReader = new FileReader();
      fileReader.readAsText(importedFile, "UTF-8");
      fileReader.onload = (e) => {
        const jsonData = JSON.parse(
          e.target?.result as string
        ) as Appointment[];

        const mappedData = jsonData.map(toCalendarAppointment).map((app) => ({
          ...app,
          title: `${app.title}-imported`,
        }));

        try {
          mappedData.forEach((app) => {
            onCreateAppointment(app);
          });
        } catch (error) {
          console.error("Error importing and adding appointments into db!");
          console.error(error);
        }
      };
    },
    [toCalendarAppointment, onCreateAppointment]
  );

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col p-4 font-mono">
        <NavBar active="admin" />

        <div className="flex w-full flex-col items-center font-light">
          <Header current="admin" />
          <div className="my-4 sm:w-4/5">
            <Form ref={formRef} method="post">
              <AdminCalendar
                events={appointments.map(toCalendarAppointment)}
                createEvent={onCreateAppointment}
                changeEvent={onChangeAppointment}
                selectEvent={setSelectedAppointment}
              />

              <div className="flex w-full flex-wrap justify-between">
                <span className="mr-8">
                  <button
                    type="button"
                    className="mt-4 mr-4 rounded-md bg-green-500 p-2 text-white"
                    onClick={onConfirmAppointment}
                  >
                    {selectedAppointment?.confirmed
                      ? "Скасувати 1"
                      : "Підтвердити 1"}
                  </button>
                  <button
                    type="button"
                    className="mt-4 mr-4 rounded-md bg-red-500 p-2 text-white"
                    onClick={onRemoveAppointment}
                  >
                    Видалити 1
                  </button>
                  <button
                    type="button"
                    className="mt-4 rounded-md bg-blue-500 p-2 text-white"
                    onClick={onExportAppointmentData}
                  >
                    Експортувати 1
                  </button>
                </span>

                <span>
                  <button
                    type="button"
                    className="mt-4 mr-4 rounded-md bg-blue-500 p-2 text-white"
                    onClick={onExportAppointmentsData}
                  >
                    Експортувати всі дані ↓
                  </button>

                  <input
                    type="file"
                    id="input_json"
                    onChange={onImportAppointmentData}
                    className="hidden"
                  />
                  <label
                    htmlFor="input_json"
                    className="mt-4 inline-block cursor-pointer rounded-md bg-violet-500 p-2 font-normal text-white"
                  >
                    Імпортувати дані ↑
                  </label>
                </span>
              </div>
            </Form>

            <h4 className="mt-4 mb-2 font-medium">Обране бронювання:</h4>
            <section>
              {selectedAppointment
                ? formatFullAppointment(selectedAppointment).map((line) => (
                    <p key={line}>{line}</p>
                  ))
                : "--"}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
