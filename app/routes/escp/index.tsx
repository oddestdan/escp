import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import { getIsMobile } from "~/utils/breakpoints";
import { BOOKING_HOURLY_PRICE } from "~/utils/constants";

// desktop
const imageSrcDesktopCollage = "https://i.imgur.com/MKN99RK.png";

// mobile
const imageSrcMobileMain = "https://i.imgur.com/KGpjCmh.png";

export default function Escp() {
  const navigate = useNavigate();
  const navigateToBooking = useCallback(() => {
    navigate("/booking");
  }, [navigate]);

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="escp" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="escp" />

        <div className="mx-auto flex flex-col text-center sm:w-3/5">
          {!isMobile ? (
            <span>
              <img
                className="ml-auto inline aspect-[8/3] w-fit bg-stone-100"
                src={imageSrcDesktopCollage}
                alt="escp.90 instax collage"
              />
            </span>
          ) : (
            <span>
              <img
                className="ml-auto mt-4 inline aspect-[1/1] w-fit bg-stone-100"
                src={imageSrcMobileMain}
                alt="escp.90 instax main"
              />
            </span>
          )}

          <p className="font-mono">Kyiv based photo studio / 90 m²</p>

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
