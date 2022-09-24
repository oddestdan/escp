import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";

const imageSrcRoute = "https://i.imgur.com/eGTIOOr.png"; // 900/600 == 3:2

export default function rules() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="contacts" />

      <div className="flex w-full flex-1 flex-col font-light sm:w-3/5">
        <h1 className="mx-auto mt-16 flex w-full justify-between font-medium text-stone-900 sm:w-3/5">
          Контакти
        </h1>
        <p className="mb-4 mt-8">
          {/* TODO: Embed instagram photo+video stories instead of a link */}
          Як нас знайти{" "}
          <a
            className="text-stone-900 underline hover:text-stone-400"
            target="_blank"
            rel="noreferrer"
            href="https://www.instagram.com/stories/highlights/17893954031170001/"
          >
            (відео)
          </a>
        </p>
        <span className="flex flex-col xl:flex-row-reverse">
          <img
            className="mb-4 aspect-[3/2] w-full flex-1 bg-stone-100 xl:w-3/5"
            src={imageSrcRoute}
            alt="Route"
          />

          <p className="mb-4 xl:pr-8">
            бул. Вацлава Гавела 4.
            <br />
            <br />
            → Прохідна через "Silver Centre"
            <br />
            → йдіть прямо вниз до останнього корпусу
            <br />
            → перед ним ліворуч та з правого боку будуть вхідні двері
            <br />→ підіймайтесь на 4й поверх
          </p>
        </span>
      </div>

      <Footer />
    </main>
  );
}
