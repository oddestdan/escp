import { useCallback, useEffect, useRef } from "react";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import {
  deletePrismaAppointment,
  getPrismaAppointmentById,
} from "~/models/appointment.server";
import invariant from "tiny-invariant";

import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import { STUDIO_ID_QS } from "~/utils/constants";
import { useBeforeUnload } from "react-use";
import Wrapper from "~/components/Wrapper/Wrapper";

type LoaderData = {
  appointment: Appointment;
  paymentId: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.paymentId, "Expected params.paymentId");

  try {
    const appointment = await getPrismaAppointmentById(params.paymentId);

    if (!appointment) {
      console.error({ message: "Appointment not found Error" });
      return redirect(`/booking?${STUDIO_ID_QS}=0`);
    }

    return json<LoaderData>({
      appointment,
      paymentId: params.paymentId,
    });
  } catch (error) {
    console.error(error);
    console.error({ message: "Payment Error" });
    return redirect(`/booking?${STUDIO_ID_QS}=0`);
  }
};

const BookingWrapper = ({
  wrappedComponent,
}: {
  wrappedComponent: JSX.Element;
}) => (
  <Wrapper activePage="booking">
    <div className="flex w-full flex-1 flex-col items-center font-light ">
      <div className="my-4 w-full sm:w-3/5">{wrappedComponent}</div>
    </div>
  </Wrapper>
);

export default function Payment() {
  const navigate = useNavigate();
  const { appointment, paymentId } = useLoaderData() as unknown as LoaderData;

  const formRef = useRef<HTMLFormElement>(null);

  const {
    studio,
    timeFrom,
    timeTo,
    date,
    contactInfo,
    services,
    price,
    id: prismaId,
  } = appointment;

  const deleteFromPrisma = useCallback(() => {
    deletePrismaAppointment(prismaId);
  }, [prismaId]);

  useBeforeUnload(() => {
    deleteFromPrisma();
    return true;
  });

  useEffect(() => {
    navigate(`/WayForPay/${paymentId}`);
  }, [navigate, paymentId]);

  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <h2 className="my-4 text-center font-medium">оплачуємо...</h2>

          <Form method="post" ref={formRef}>
            <input type="hidden" name="studio" value={studio} />
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
