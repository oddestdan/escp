import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import { BOOKING_HOURLY_PRICE, STUDIO_ID_QS } from "~/utils/constants";

// desktop
import imageSrcDesktopCollage from "../../../public/images/escp-collage.jpg";

// mobile
import imageSrcMobileMain from "../../../public/images/escp-instax.jpg";

export default function Escp() {
  const navigate = useNavigate();
  const navigateToBooking = useCallback(() => {
    navigate(`/booking?${STUDIO_ID_QS}=0`);
  }, [navigate]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="escp" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="escp" />

        <div className="mx-auto flex flex-col text-center sm:w-3/5">
          {/* Images wrappers */}
          <span>
            <img
              className="ml-auto mt-4 hidden aspect-[8/3] w-fit bg-stone-100 md:inline"
              src={imageSrcDesktopCollage}
              alt="escp.90 instax collage"
            />
          </span>
          <span>
            <img
              className="ml-auto inline aspect-[1/1] w-fit bg-stone-100 md:hidden"
              src={imageSrcMobileMain}
              alt="escp.90 instax main"
            />
          </span>

          <p className="font-head text-2xl font-bold">
            Kyiv based photo studio / 90 m²
          </p>
          <p className="mt-2 font-head">
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
