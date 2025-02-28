import { useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import {
  createAppointment,
  deletePrismaAppointment,
  getPrismaAppointmentById,
} from "~/models/appointment.server";
import invariant from "tiny-invariant";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { BOOKING_TIME_TAKEN_QS, STUDIO_ID_QS } from "~/utils/constants";
import { generateAppointmentPaymentData } from "~/lib/wayforpay.service";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { studiosData } from "~/utils/studiosData";

type LoaderData = {
  paymentData: Awaited<ReturnType<typeof generateAppointmentPaymentData>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.paymentId, "Expected params.paymentId");

  try {
    const appointment = await getPrismaAppointmentById(params.paymentId);
    console.log({ at: "paymentId", prismaAppointment: appointment });

    if (!appointment) {
      console.error({ message: "Appointment not found Error" });
      return redirect(`/booking?${STUDIO_ID_QS}=0`);
    }

    const paymentData = await generateAppointmentPaymentData(appointment);
    console.log({ paymentData });

    if (!paymentData) {
      console.error({ message: "Payment info generation Error" });
      return redirect(`/booking?${STUDIO_ID_QS}=0`);
    }

    return json<LoaderData>({ paymentData });
  } catch (error) {
    console.error(error);
    console.error({ message: "Payment Error" });
    return redirect(`/booking?${STUDIO_ID_QS}=0`);
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  console.log("RUNNING ACTION WAYFORPAY");
  const method = request.method;

  switch (method) {
    case "POST": {
      console.log("RUNNING ACTION WAYFORPAY > POST");

      invariant(params.paymentId, "Expected params.paymentId");

      const appointment = await getPrismaAppointmentById(params.paymentId);

      if (!appointment) {
        console.error({ message: "Appointment not found Error" });
        return redirect(`/booking?${STUDIO_ID_QS}=0`);
      }

      console.log(">> Creating an appointment into Google API");

      const studioParsed = JSON.parse(appointment.studio) as StudioInfo;
      const studioId =
        studiosData.findIndex((s) => s.name === studioParsed.name) || 0;
      const createdAppointment = await createAppointment(appointment, studioId);

      console.log({ googleCreatedAppointment: createdAppointment });

      try {
        deletePrismaAppointment(params.paymentId);
      } catch (error) {
        console.log({ at: "deletePrismaError", error });
      }

      if (!createdAppointment) {
        return redirect(
          `/booking?${STUDIO_ID_QS}=${studioId}&${BOOKING_TIME_TAKEN_QS}=true`
        );
      }
      return redirect(
        `/booking/confirmation/${createdAppointment.id}?${STUDIO_ID_QS}=${studioId}`
      );
    }
    default:
      return null;
  }
};

export default function WayForPay() {
  const formRef = useRef<HTMLFormElement>(null);
  const { paymentData } = useLoaderData() as unknown as LoaderData;

  useEffect(() => {
    // Automatically submit the form when the component loads
    console.log("Automatically submit the form when the component loads");
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  return (
    <div>
      WayForPay page
      <form
        ref={formRef}
        method="POST"
        action="https://secure.wayforpay.com/pay"
        encType="application/x-www-form-urlencoded"
      >
        {/* <input
          type="hidden"
          name="merchantAccount"
          value={paymentData.merchantAccount}
        />
        <input
          type="hidden"
          name="merchantDomainName"
          value={paymentData.merchantDomainName}
        /> */}
        {Object.entries(paymentData).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      </form>
    </div>
  );
}
