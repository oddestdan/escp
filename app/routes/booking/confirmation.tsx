import { Link } from "@remix-run/react";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import NavBar from "~/components/NavBar/NavBar";

const imageSrcHurray = "https://i.imgur.com/iGfxlZi.png";

export default function Confirmation() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 font-mono">
      <NavBar />

      <div className="flex w-full flex-col font-light">
        <Header />

        <div className="mx-auto flex flex-col text-center sm:w-3/5">
          <img
            className="my-4 mx-auto aspect-[1/1] w-32 rounded-full"
            src={imageSrcHurray}
            alt="Hurray"
          />
          <h2 className="my-4 font-bold">ура! замовлення успішно створено</h2>
          <p className="mt-4">
            очікуємо від вас підтвердження вашої оплати і все готово.
          </p>
          <p className="mb-4">бережіть себе та свої рідних, чекаємо вас.</p>
          <div className="my-4">
            <Link
              className="text-stone-900 underline hover:text-stone-400"
              to="/booking"
            >
              забукати щось ще
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
