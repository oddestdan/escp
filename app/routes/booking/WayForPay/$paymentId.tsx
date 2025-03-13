import { redirect } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import {
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  getPrismaAppointmentById,
} from "~/models/appointment.server";
import invariant from "tiny-invariant";

import type { ActionFunction } from "@remix-run/server-runtime";
import {
  BOOKING_TIME_TAKEN_QS,
  STUDIO_ID_QS,
  WFP_ERROR_QS,
} from "~/utils/constants";
import type { WayForPayPaymentResponse } from "~/lib/wayforpay.service";
import {
  WFP_OK_STATUS_CODE,
  wfpRedirectDelimeter,
} from "~/lib/wayforpay.service";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { studiosData } from "~/utils/studiosData";
import Wrapper from "~/components/Wrapper/Wrapper";
import { IS_POST_CREATION_FLOW } from "~/store/bookingSlice";

const retrieveStudioId = (appointment: Appointment) => {
  const studioParsed = JSON.parse(appointment.studio) as StudioInfo;
  return studiosData.findIndex((s) => s.name === studioParsed.name) || 0;
};

// TODO: remove preCreated calendar appointment on error cases
const modifyCalendarAppointment = async (
  wfpResponse: WayForPayPaymentResponse,
  paymentId: string,
  preCreatedCalendarAppointmentId: string,
  studioId = "0"
) => {
  try {
    console.log(">> Modifying an appointment in Google API");

    if (Number(wfpResponse.reasonCode) !== WFP_OK_STATUS_CODE) {
      console.error({
        message: `WayForPay Error: "${wfpResponse.reason}" ${wfpResponse.reasonCode}: "${wfpResponse.transactionStatus}"`,
      });

      await deleteAppointment(
        preCreatedCalendarAppointmentId,
        Number(studioId)
      );

      return redirect(
        `/booking?${STUDIO_ID_QS}=${studioId}&${WFP_ERROR_QS}=true`
      );
    }

    const prismaAppointment = await getPrismaAppointmentById(paymentId);

    if (!prismaAppointment) {
      console.error({
        message: `WayForPay/Action.POST: Prisma Appointment not found Error (${paymentId})`,
      });

      return redirect(
        `/booking/confirmation/${preCreatedCalendarAppointmentId}?${STUDIO_ID_QS}=${studioId}&notFound=prisma`
      );
    }

    const modifiedAppointment = await confirmAppointment(
      prismaAppointment,
      preCreatedCalendarAppointmentId,
      Number(studioId)
    );

    return redirect(
      `/booking/confirmation/${modifiedAppointment.id}?${STUDIO_ID_QS}=${studioId}`
    );
  } catch (error) {
    console.error("Error modifying calendar appointment");
    console.error(error);
    return null;
  }
};

const createCalendarAppointment = async (
  wfpResponse: WayForPayPaymentResponse,
  paymentId: string
) => {
  try {
    console.log(">> Creating an appointment into Google API");

    // https://wiki.wayforpay.com/ru/view/852131
    if (Number(wfpResponse.reasonCode) !== WFP_OK_STATUS_CODE) {
      console.error({
        message: `WayForPay Error: "${wfpResponse.reason}" ${wfpResponse.reasonCode}: "${wfpResponse.transactionStatus}"`,
      });

      // deletePrismaAppointment(params.paymentId); ???

      return redirect(`/booking?${STUDIO_ID_QS}=0&${WFP_ERROR_QS}=true`);
    }

    const appointment = await getPrismaAppointmentById(paymentId);

    if (!appointment) {
      console.error({
        message: `WayForPay/Action.POST: Appointment not found Error (${paymentId})`,
      });
      return redirect(`/booking?${STUDIO_ID_QS}=0&notFound=wayforpay`);
    }

    const studioId = retrieveStudioId(appointment);
    console.log({ studioId, appointment, wfpResponse });

    console.log(">> Creating an appointment into Google API");
    const createdAppointment = await createAppointment(appointment, studioId);

    console.log({ googleCreatedAppointment: createdAppointment });

    // deletePrismaAppointment(params.paymentId); ???

    if (!createdAppointment) {
      return redirect(
        `/booking?${STUDIO_ID_QS}=${studioId}&${BOOKING_TIME_TAKEN_QS}=true`
      );
    }
    console.log("REDIRECTING TO CONFIRMATION");
    return redirect(
      `/booking/confirmation/${createdAppointment.id}?${STUDIO_ID_QS}=${studioId}`
    );
  } catch (error) {
    console.error("Error creating calendar appointment");
    console.error(error);
    return null;
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  console.log("RUNNING ACTION WAYFORPAY");

  const formData = await request.formData();
  const wfpResponse = Object.fromEntries(
    formData
  ) as unknown as WayForPayPaymentResponse;
  console.log({ wfpResponse, params, request });

  const method = request.method;

  switch (method) {
    case "POST": {
      invariant(params.paymentId, "Expected params.paymentId");
      if (IS_POST_CREATION_FLOW) {
        // create a new appointment
        return createCalendarAppointment(wfpResponse, params.paymentId);
      } else {
        // modify already existing appointment
        const [paymentId, preCreatedCalendarAppointmentId, studioId] =
          params.paymentId.split(wfpRedirectDelimeter);

        invariant(paymentId, "Expected paymentId as string");
        invariant(
          preCreatedCalendarAppointmentId,
          "Expected preCreatedCalendarAppointmentId as string"
        );
        invariant(studioId, "Expected studioId as string");

        return modifyCalendarAppointment(
          wfpResponse,
          paymentId,
          preCreatedCalendarAppointmentId,
          studioId
        );
      }
    }
    default:
      return null;
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

export default function WayForPay() {
  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <h2 className="my-4 text-center font-medium">
            WayForPay: оплачуємо...
          </h2>
        </>
      }
    />
  );
}
