import { redirect } from "@remix-run/server-runtime";
import {
  createAppointment,
  deletePrismaAppointment,
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
import { WFP_OK_STATUS_CODE } from "~/lib/wayforpay.service";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { studiosData } from "~/utils/studiosData";
import Wrapper from "~/components/Wrapper/Wrapper";

// type LoaderData = {
//   appointment: Appointment;
//   paymentData: Awaited<ReturnType<typeof generateAppointmentPaymentData>>;
// };

// export const loader: LoaderFunction = async ({ params }) => {
//   invariant(params.paymentId, "Expected params.paymentId");

//   try {
//     const appointment = await getPrismaAppointmentById(params.paymentId);
//     console.log({ at: "paymentId", prismaAppointment: appointment });

//     if (!appointment) {
//       console.error({
//         message: `WayForPay/Loader: Appointment not found Error (${params.paymentId})`,
//       });
//       return redirect(
//         `/booking?${STUDIO_ID_QS}=0&notFound=wayforpay&${BOOKING_TIME_TAKEN_QS}=true`
//       );
//     }

//     const paymentData = await generateAppointmentPaymentData(appointment);
//     console.log({ paymentData });

//     if (!paymentData) {
//       console.error({ message: "Payment info generation Error" });
//       return redirect(`/booking?${STUDIO_ID_QS}=0`);
//     }

//     return json<LoaderData>({ paymentData, appointment });
//   } catch (error) {
//     console.error(error);
//     console.error({ message: "Payment Error" });
//     return redirect(`/booking?${STUDIO_ID_QS}=0`);
//   }
// };

export const action: ActionFunction = async ({ request, params }) => {
  console.log("RUNNING ACTION WAYFORPAY");

  const formData = await request.formData();
  const wfpResponse = Object.fromEntries(
    formData
  ) as unknown as WayForPayPaymentResponse;

  const method = request.method;

  switch (method) {
    case "POST": {
      invariant(params.paymentId, "Expected params.paymentId");

      const appointment = await getPrismaAppointmentById(params.paymentId);

      if (!appointment) {
        console.error({
          message: `WayForPay/Action.POST: Appointment not found Error (${params.paymentId})`,
        });
        return redirect(`/booking?${STUDIO_ID_QS}=0`);
      }

      console.log(">> Creating an appointment into Google API");

      const studioParsed = JSON.parse(appointment.studio) as StudioInfo;
      const studioId =
        studiosData.findIndex((s) => s.name === studioParsed.name) || 0;

      // https://wiki.wayforpay.com/ru/view/852131
      if (Number(wfpResponse.reasonCode) !== WFP_OK_STATUS_CODE) {
        console.error({
          message: `WayForPay Error: "${wfpResponse.reason}" ${wfpResponse.reasonCode}: "${wfpResponse.transactionStatus}"`,
        });

        try {
          await deletePrismaAppointment(params.paymentId);
        } catch (error) {
          console.log({ at: "deletePrismaError", error });
        }

        return redirect(
          `/booking?${STUDIO_ID_QS}=${studioId}&${WFP_ERROR_QS}=true`
        );
      }

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
  // const formRef = useRef<HTMLFormElement>(null);
  // const { paymentData } = useLoaderData() as unknown as LoaderData;

  // useEffect(() => {
  //   // Automatically submit the form when the component loads
  //   console.log("Automatically submit the form when the component loads");
  //   if (formRef.current) {
  //     formRef.current.submit();
  //   }
  // }, []);

  // useDeleteAppointmentBeforeUnload(appointment.id);

  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <h2 className="my-4 text-center font-medium">
            WayForPay: оплачуємо...
          </h2>
          {/* <form
            ref={formRef}
            method="POST"
            action="https://secure.wayforpay.com/pay"
            encType="application/x-www-form-urlencoded"
          > */}
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
          {/* {Object.entries(paymentData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form> */}
        </>
      }
    />
  );
}
