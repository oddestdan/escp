import { useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import { CopyableCard } from "~/components/CopyableCard/CopyableCard";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import { Separator } from "~/components/Separator/Separator";
import { clearAll } from "~/store/bookingSlice";
import { getAppointmentById } from "~/models/appointment.server";
import { json } from "@remix-run/server-runtime";
import type { Appointment } from "~/models/appointment.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

const imageSrcHurray = "https://i.imgur.com/iGfxlZi.png";

type LoaderData = { appointment: Appointment };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.confirmationId, "Expected params.confirmationId");

  const appointment = await getAppointmentById(params.confirmationId);
  if (!appointment) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ appointment });
};

export default function Confirmation() {
  const { appointment } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cleanupCb = useCallback(() => dispatch(clearAll()), [dispatch]);

  const navigateToBooking = useCallback(() => {
    navigate("/booking");
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

  const allServices = JSON.parse(appointment.services);
  const mappedAppointment = {
    dateTime: {
      date: appointment.date,
      time: {
        start: appointment.timeFrom,
        end: appointment.timeTo,
        diff: +appointment.price, // TODO: ???
      },
      slots: [],
    },
    services: allServices.services,
    additionalServices: allServices.additionalServices,
    price: {
      booking: +appointment.price,
    },
    contact: JSON.parse(appointment.contactInfo),
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header />

        <div className="mx-auto flex flex-col sm:w-3/5">
          <img
            className="my-4 mx-auto aspect-[1/1] w-32 rounded-full text-center"
            src={imageSrcHurray}
            alt="Hurray"
          />
          <h2 className="my-4 text-center font-mono font-medium">
            ура!
            <br />
            замовлення успішно створено
          </h2>

          <h4 className="mb-4 block text-center font-mono text-2xl font-medium underline">
            {mappedAppointment.price.booking} грн
          </h4>

          <BookingSummary summary={mappedAppointment} />

          <Separator />

          <CopyableCard />

          <p className="mb-4">
            Очікуємо від вас підтвердження вашої оплати і все готово.
            <br />
            Бережіть себе та свої рідних, чекаємо вас.
          </p>
          <div className="my-4">
            <ActionButton inverted={true} onClick={navigateToBooking}>
              забронювати ще
            </ActionButton>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
