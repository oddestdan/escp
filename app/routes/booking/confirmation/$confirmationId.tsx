import { Link, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { Separator } from "~/components/Separator/Separator";
import { clearAll } from "~/store/bookingSlice";
import { getAppointmentById } from "~/models/appointment.server";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getHoursDiffBetweenDates } from "~/utils/date";
import {
  BOOKING_HOURLY_PRICE,
  CONTACTS_CURRENT_TAB_QS,
  ERROR_404_APPOINTMENT_BY_ID_MSG,
  ERROR_SOMETHING_BAD_HAPPENED,
  STUDIO_ID_QS,
} from "~/utils/constants";

import type { LoaderFunction } from "@remix-run/server-runtime";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import Wrapper from "~/components/Wrapper/Wrapper";

const imageSrcHurray = "https://i.imgur.com/iGfxlZi.png";

type LoaderData = {
  appointmentResponse: Awaited<ReturnType<typeof getAppointmentById>>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.confirmationId, "Expected params.confirmationId");

  const studioId = new URL(request.url).searchParams.get(STUDIO_ID_QS);

  try {
    const appointmentResponse = await getAppointmentById(
      params.confirmationId,
      studioId ? Number(studioId) : undefined
    );

    if (!appointmentResponse) {
      throw json({ message: "Not Found", id: params.confirmationId }, 404);
    }

    return json<LoaderData>({ appointmentResponse });
  } catch (error) {
    throw json({ message: "Not Found", id: params.confirmationId }, 404);
  }
};

const BookingWrapper = ({
  wrappedComponent,
}: {
  wrappedComponent: JSX.Element;
}) => (
  <Wrapper activePage="booking">
    <div className="flex w-full flex-1 flex-col items-center font-light ">
      <div className="w-full sm:w-3/5">{wrappedComponent}</div>
    </div>
  </Wrapper>
);

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <div className="mb-4 text-xl font-medium text-red-500">
            Помилка {caught.status} {caught.statusText}
          </div>

          <div className="w-full bg-white">
            <span className="text-red-500">
              {caught.status === 404
                ? `${ERROR_404_APPOINTMENT_BY_ID_MSG} ${caught.data.id}`
                : ERROR_SOMETHING_BAD_HAPPENED}
            </span>
          </div>
        </>
      }
    />
  );
}

export default function Confirmation() {
  const {
    appointmentResponse: { data: appointment },
  } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cleanupCb = useCallback(() => dispatch(clearAll()), [dispatch]);

  const navigateToBooking = useCallback(() => {
    navigate(`/booking?${STUDIO_ID_QS}=0`);
  }, [navigate]);

  // redirect if not sufficient information
  useEffect(() => {
    if (!appointment.id) {
      navigateToBooking();
    }
  }, [navigateToBooking, appointment]);

  // cleanup
  useEffect(() => {
    cleanupCb();
  }, [dispatch, cleanupCb]);

  const { start, end, extendedProperties } = appointment;

  const hasNoEndTime = !end || (!end.dateTime && !end.date);
  const hasNoStartTime = !start || (!start.dateTime && !start.date);
  const hasNoSufficientData =
    !extendedProperties || !extendedProperties.private;

  if (hasNoEndTime || hasNoStartTime || hasNoSufficientData) {
    return (
      <div className="w-100 my-auto flex h-[100vh] flex-col justify-center text-center text-2xl">
        😭
        <br />
        помилка при завантаженні замовлення
      </div>
    );
  }

  const stringifiedData = extendedProperties.private;

  const bookingPrice =
    Math.abs(
      getHoursDiffBetweenDates(
        new Date(appointment.end!.dateTime as string),
        new Date(appointment.start!.dateTime as string)
      )
    ) * BOOKING_HOURLY_PRICE;

  const studio: StudioInfo = JSON.parse(
    stringifiedData!.studio || `{ "name": "escp.90", "area": 90 }`
  );
  const allServices = JSON.parse(stringifiedData!.services);
  const mappedAppointment = {
    studio,
    dateTime: {
      date: appointment.start!.dateTime!.split("T")[0],
      time: {
        start: appointment.start!.dateTime as string,
        end: appointment.end!.dateTime as string,
        diff: bookingPrice / BOOKING_HOURLY_PRICE,
      },
      slots: [],
      hasWeekChanged: false,
    },
    services: allServices.services,
    additionalServices: allServices.additionalServices,
    price: {
      booking: bookingPrice,
      services: +stringifiedData!.price - bookingPrice,
    },
    contact: JSON.parse(stringifiedData!.contactInfo),
  };

  return (
    <BookingWrapper
      wrappedComponent={
        <>
          <img
            className="my-4 mx-auto aspect-[1/1] w-24 rounded-full text-center"
            src={imageSrcHurray}
            alt="Hurray"
          />
          <h2 className="my-4 text-center font-medium">
            ура!
            <br />
            замовлення успішно сплачено
            {/* замовлення успішно створено */}
          </h2>

          <h4 className="mb-4 block text-center text-2xl font-medium underline">
            {mappedAppointment.price.booking +
              (mappedAppointment.price.services || 0)}{" "}
            грн
          </h4>

          <BookingSummary summary={mappedAppointment} />

          <Separator />

          {/* <p className="my-4">
            Біп-біп! Очікуємо від вас підтвердження вашої оплати і все готово.
          </p>

          <CopyableCard /> */}

          <p className="mb-4">
            Обов'язково перегляньте навігацію{" "}
            <Link
              to={`/contacts?${CONTACTS_CURRENT_TAB_QS}=0`}
              className={`text-stone-900 underline hover:text-stone-400`}
            >
              як нас знайти на території
            </Link>{" "}
            та приїзжайте завчасно.
          </p>
          <p className="mb-4">
            До зустрічі ✨{/* Бережіть себе та свої рідних, чекаємо✨ */}
          </p>
          <div className="mb-4 mt-8">
            <ActionButton inverted={true} onClick={navigateToBooking}>
              забронювати ще
            </ActionButton>
          </div>
        </>
      }
    />
  );
}
