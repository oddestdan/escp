import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";

import imageSrcRoute from "../../../public/images/route.jpg";
import { useSearchParams } from "@remix-run/react";
import { useMemo, useState } from "react";
import { CONTACTS_CURRENT_TAB_PARAM } from "~/utils/constants";

const renderByFootTab = () => (
  <div className="flex flex-col pt-2 pb-4 xl:flex-row-reverse">
    <img
      className="mb-4 aspect-[3/2] w-full flex-1 bg-stone-100 xl:w-3/5"
      src={imageSrcRoute}
      alt="Route"
    />

    <p className="mb-4 xl:pr-8">
      {/* TODO: Embed instagram photo+video stories instead of a link */}
      <a
        className="text-stone-900 underline hover:text-stone-400"
        target="_blank"
        rel="noreferrer"
        href="https://www.instagram.com/stories/highlights/17893954031170001/"
      >
        Відео тур
      </a>
      <br />
      <br />→ Прохідна через "Silver Centre"
      <br />→ йдіть прямо донизу до останнього корпусу
      <br />→ перед ним ліворуч та з правого боку розташовані вхідні двері
      <br />→ підніміться на 4й поверх
    </p>
  </div>
);

const renderByCarTab = () => (
  <div className="flex flex-col pt-2 pb-4 xl:flex-row-reverse">
    <p className="mb-4 min-w-[50%] flex-1">
      <iframe
        className="aspect-[9/16] w-full xl:aspect-[1/1]"
        title="Getting by car"
        src="https://www.youtube.com/embed/9K-G9kvpRS0"
      ></iframe>
    </p>
    <p className="mb-4 flex-1 xl:pr-8">
      <br />→ Заїзд за магазином «Фора»
      <br />→ спускайтесь прямо донизу
      <br />→ поверніть праворуч
      <br />→ рухайтесь прямо вздовж паркувальних місць до самого кінця
      <br />→ поверніть двічі праворуч між двома будівлями
      <br />→ одразу за навісним цегляним переходом ліворуч розташоване наше
      місце для паркінгу (escp.90), а праворуч — вхідні двері
      <br />→ підніміться на 4й поверх
    </p>
  </div>
);

export default function Contacts() {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(
    () =>
      searchParams.get(CONTACTS_CURRENT_TAB_PARAM) ||
      // ls.getItem(LS_FOOT_OR_CAR, "0") ||
      "0"
  );
  console.log({ currentTab, searchParams });

  const setTab = (tab: string) => {
    // ls.setItem(LS_FOOT_OR_CAR, tab);
    setCurrentTab(tab);
  };

  const renderedTab = useMemo(
    () => (currentTab === "0" ? renderByFootTab() : renderByCarTab()),
    [currentTab]
  );

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="contacts" />

      <div className="flex w-full flex-1 flex-col font-light sm:w-3/5">
        <h1 className="mx-auto mt-16 flex w-full justify-between font-medium text-stone-900">
          Контакти
        </h1>

        <h3 className="text-center">
          <p className="mt-4">
            <a
              className="text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://goo.gl/maps/7uJN7RM6n7YDh8fk6"
            >
              Бул. Вацлава Гавела, 4.
            </a>{" "}
            Як нас знайти:
          </p>
          {["Пішки", "На авто"].map((tabName, tabIndex) => {
            console.log({ currentTab, tabIndex, tabName });
            return (
              <span key={tabName}>
                <span
                  onClick={() => setTab(`${tabIndex}`)}
                  className={`inline-block px-2 py-2 text-stone-900 ${
                    +currentTab === tabIndex
                      ? "font-medium underline"
                      : "cursor-pointer hover:text-stone-400"
                  }`}
                >
                  {tabName}
                </span>
                {tabIndex !== 1 && <span className="px-2"> | </span>}
              </span>
            );
          })}
        </h3>

        {renderedTab}
      </div>

      <Footer />
    </main>
  );
}
