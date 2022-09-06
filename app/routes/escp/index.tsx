import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import { BOOKING_HOURLY_PRICE } from "~/utils/constants";

// TODO: Use two adjacent photos
const imageSrcFront = "https://i.imgur.com/vXQjup8.jpg";
const imageSrcBack = "https://i.imgur.com/SLE4MrH.jpg";

export default function Escp() {
  const navigate = useNavigate();
  const navigateToBooking = useCallback(() => {
    navigate("/booking");
  }, [navigate]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="escp" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="escp" />

        <div className="mx-auto mb-4 flex flex-col text-center sm:w-3/5">
          <span>
            <img
              className="ml-auto mt-4 inline aspect-[3/2] w-fit bg-stone-100 xl:w-1/2"
              src={imageSrcFront}
              alt="Hall front"
            />
            <img
              className="ml-auto mt-4 hidden aspect-[3/2] w-1/2 bg-stone-100 xl:inline"
              src={imageSrcBack}
              alt="Hall back"
            />
          </span>

          <p className="mt-8 font-mono">Kyiv based photo studio / 90 m²</p>

          <p className="mt-2 font-mono">
            вартість оренди: {BOOKING_HOURLY_PRICE} грн/год
          </p>

          <p className="mt-16">
            <ActionButton inverted={true} onClick={navigateToBooking}>
              забронювати
            </ActionButton>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
