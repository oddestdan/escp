import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";

const imageSrcFront = "https://i.imgur.com/2gUgtbh.jpg";

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
          <img
            className="mt-4 aspect-[3/2] w-full bg-stone-100"
            src={imageSrcFront}
            alt="Hall front"
          />

          <p className="mt-4 font-mono">Kyiv based photo studio / 90 m²</p>

          <p className="mt-4 font-mono">вартість оренди: 600 грн/год</p>

          <p className="mt-8">
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
