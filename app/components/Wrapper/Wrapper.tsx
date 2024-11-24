import { Link, useNavigate } from "@remix-run/react";
import { useCallback, type PropsWithChildren } from "react";
import NavBar from "../NavBar/NavBar";
import Header from "../Header/Header";
import { ActionButton } from "../ActionButton/ActionButton";
import { STUDIO_ID_QS } from "~/utils/constants";
import Footer from "../Footer/Footer";
import Scrollbar from "react-scrollbars-custom";

interface WrapperProps {
  activePage: string;
  isEquallyDistributed?: boolean;
  hasBookingAction?: boolean;
}

const Wrapper = ({
  activePage,
  isEquallyDistributed = false,
  hasBookingAction = false,
  children,
}: PropsWithChildren<WrapperProps>) => {
  const navigate = useNavigate();
  const navigateToBooking = useCallback(() => {
    navigate(`/booking?${STUDIO_ID_QS}=0`);
  }, [navigate]);

  return (
    //   TODO: when xl: -> modify layout
    <main className="items-between flex min-h-screen w-full flex-col gap-4 px-5 md:flex-row md:gap-8 md:px-8">
      <section
        className={`flex flex-col justify-between pt-8 md:py-8 ${
          !isEquallyDistributed ? "w-full md:w-fit" : "w-full md:w-1/3"
        }`}
      >
        <div className="flex flex-row items-center justify-between md:flex-col md:items-start md:justify-start">
          <Link
            to="/escp"
            className={`text-2xl font-medium text-stone-800 hover:text-stone-400 md:text-4xl`}
          >
            escp.90
          </Link>

          <div className="flex gap-4 md:hidden">
            <NavBar active={activePage} />
            <Header current={activePage} />
          </div>

          <div className="relative mt-10 hidden gap-4 md:flex">
            <NavBar active={activePage} />
            <Header current={activePage} />
          </div>
        </div>
        {hasBookingAction && (
          <p className="mt-8 hidden md:mt-16 md:block">
            <ActionButton inverted onClick={navigateToBooking}>
              забронювати
            </ActionButton>
          </p>
        )}
      </section>
      {/* TODO: discuss with gang */}
      {/* <div className="h-screen w-[2px] bg-stone-700"></div> */}
      <Scrollbar
        className={`my-4 hidden min-h-[70vh] flex-col justify-between md:my-8 md:flex md:max-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] ${
          !isEquallyDistributed ? "flex-grow" : "!w-full xl:!w-1/3"
        }`}
      >
        {children}
      </Scrollbar>

      <section
        className={`flex flex-col justify-between py-4 md:hidden md:py-8 ${
          !isEquallyDistributed ? "flex-grow" : "!w-full xl:!w-1/3"
        }`}
      >
        {children}
        {hasBookingAction && (
          <p className="mt-4 md:mt-16 md:hidden">
            <ActionButton inverted onClick={navigateToBooking}>
              забронювати
            </ActionButton>
          </p>
        )}
      </section>
      {/* TODO: discuss with gang */}
      {/* <div className="h-screen w-[2px] bg-stone-700"></div> */}
      <section
        className={`flex flex-col justify-between py-4 md:py-8 ${
          !isEquallyDistributed ? "w-full md:w-fit" : "w-full md:w-1/3"
        }`}
      >
        <Footer />
      </section>
    </main>
  );
};

export default Wrapper;
