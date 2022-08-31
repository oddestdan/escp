import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionButton } from "~/components/ActionButton/ActionButton";
import { BookingSummary } from "~/components/BookingSummary/BookingSummary";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";
import { Separator } from "~/components/Separator/Separator";
import type { StoreBooking } from "~/store/bookingSlice";
import { clearAll } from "~/store/bookingSlice";

const imageSrcHurray = "https://i.imgur.com/iGfxlZi.png";

// TODO: Take data from url or somehow else to display correct data
// Cleanup when landing on the page instead of before unloading
export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cleanupCb = useCallback(() => dispatch(clearAll()), [dispatch]);
  const {
    dateTime: { time },
  } = useSelector((store: StoreBooking) => store.booking);

  const navigateToBooking = useCallback(() => {
    navigate("/booking");
  }, [navigate]);

  // redirect if not sufficient information
  useEffect(() => {
    if (time.start && time.end) {
      return;
    }
    navigate("/booking");
  }, [navigate, time.end, time.start]);

  // cleanup
  useEffect(
    () => () => {
      cleanupCb();
    },
    [dispatch, cleanupCb]
  );

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

          <BookingSummary />

          <Separator />

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
