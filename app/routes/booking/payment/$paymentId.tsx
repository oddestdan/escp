import { useEffect, useRef } from "react";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import {
  createAppointment,
  deletePrismaAppointment,
  generateAppointmentPaymentData,
  getPrismaAppointmentById,
} from "~/models/appointment.server";
import invariant from "tiny-invariant";

import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import {
  BOOKING_TIME_GENERIC_ERROR_MSG,
  BOOKING_TIME_TAKEN_QS,
} from "~/utils/constants";
import { setErrorMessage } from "~/store/bookingSlice";
import { useDispatch } from "react-redux";
import { useWFPWidgetListener } from "~/utils/hooks/useWFPWidgetListener.hook";

type LoaderData = {
  paymentData: Awaited<ReturnType<typeof generateAppointmentPaymentData>>;
  appointment: Appointment;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.paymentId, "Expected params.confirmationId");

  try {
    const appointment = await getPrismaAppointmentById(params.paymentId);

    if (!appointment) {
      throw json({ message: "Appointment not found Error" }, 500);
    }

    const paymentData = await generateAppointmentPaymentData(appointment);

    if (!paymentData) {
      throw json({ message: "Payment info generation Error" }, 500);
    }

    return json<LoaderData>({ paymentData, appointment });
  } catch (error) {
    console.error(error);
    throw json({ message: "Payment Error" }, 500);
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const method = request.method;

  switch (method) {
    case "POST": {
      console.log(">> Creating an appointment into Google API");
      const prismaId = formData.get("prismaId");
      const date = formData.get("date");
      const timeFrom = formData.get("timeFrom");
      const timeTo = formData.get("timeTo");
      const services = formData.get("services");
      const contactInfo = formData.get("contactInfo");
      const price = formData.get("price");

      invariant(typeof prismaId === "string", "prismaId must be a string");
      invariant(typeof date === "string", "date must be a string");
      invariant(typeof timeFrom === "string", "timeFrom must be a string");
      invariant(typeof timeTo === "string", "timeTo must be a string");
      invariant(typeof services === "string", "services must be a string");
      invariant(
        typeof contactInfo === "string",
        "contactInfo must be a string"
      );
      invariant(typeof price === "string", "price must be a string");

      const appointmentDTO = {
        date,
        timeFrom,
        timeTo,
        services,
        contactInfo,
        price,
      };

      const createdAppointment = await createAppointment(appointmentDTO);
      console.log({ createdAppointment });

      deletePrismaAppointment(prismaId);

      if (!createdAppointment) {
        return redirect(`/booking?${BOOKING_TIME_TAKEN_QS}=true`);
      }

      return redirect(`/booking/confirmation/${createdAppointment.id}`);
    }
    case "PATCH": {
      console.log(">> Navigating back to /booking after unsuccessful payment");

      const prismaId = formData.get("prismaId");
      invariant(typeof prismaId === "string", "prismaId must be a string");

      deletePrismaAppointment(prismaId);

      return redirect(`/booking`);
    }
    default:
      return null;
  }
};

const Wrapper = ({ wrappedComponent }: { wrappedComponent: JSX.Element }) => (
  <main className="flex min-h-screen w-full flex-col p-4">
    <NavBar active="booking" />

    <div className="flex w-full flex-1 flex-col items-center font-light ">
      <Header current="booking" />
      <div className="my-4 w-full sm:w-3/5">{wrappedComponent}</div>
    </div>

    <Footer />
  </main>
);

export default function Payment() {
  const submit = useSubmit();
  const dispatch = useDispatch();
  const { paymentData, appointment } = useLoaderData() as LoaderData;

  const formRef = useRef<HTMLFormElement>(null);

  const {
    timeFrom,
    timeTo,
    date,
    contactInfo,
    services,
    price,
    id: prismaId,
  } = appointment;

  useWFPWidgetListener(() => {
    const formData = new FormData(formRef.current || undefined);
    submit(formData, { method: "patch" }); // back to /booking
  });

  useEffect(() => {
    const formData = new FormData(formRef.current || undefined);
    const wfpConstructor = (window as any).Wayforpay;
    console.log({ wfpConstructor });

    if (!wfpConstructor) {
      submit(formData, { method: "patch" }); // back to /booking
      return;
    }

    new wfpConstructor().run(
      { ...paymentData, straightWidget: true },
      function (response: any) {
        console.log("WFP/ on approved");

        submit(formData, { method: "post" });
      },
      function (response: any) {
        console.log("WFP/ on declined");

        dispatch(setErrorMessage(BOOKING_TIME_GENERIC_ERROR_MSG));
        setTimeout(() => dispatch(setErrorMessage("")), 7000);
        // submit(formData, { method: "patch" }); // back to /booking
      },
      function (response: any) {
        console.log("WFP/ on pending or in processing");
      }
    );
  }, [dispatch, paymentData, submit]);

  return (
    <Wrapper
      wrappedComponent={
        <>
          <h2 className="my-4 text-center font-mono font-medium">
            оплачуємо...
          </h2>

          <Form method="post" ref={formRef}>
            <input type="hidden" name="prismaId" value={prismaId} />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="timeFrom" value={timeFrom} />
            <input type="hidden" name="timeTo" value={timeTo} />
            <input type="hidden" name="services" value={services} />
            <input type="hidden" name="contactInfo" value={contactInfo} />
            <input type="hidden" name="price" value={price} />
          </Form>
        </>
      }
    />
  );
}