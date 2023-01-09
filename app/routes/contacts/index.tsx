import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";

import { useSearchParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { CONTACTS_CURRENT_TAB_PARAM } from "~/utils/constants";
import ReactTooltip from "react-tooltip";

import imageSrcRouteFoot from "../../../public/images/route-foot.png";
import imageSrcRouteCar from "../../../public/images/route-car.png";

const byFootText = `
      <br />Прохідна через "Silver Centre"
      <br />йдіть прямо донизу до останнього корпусу
      <br />перед ним ліворуч та з правого боку розташовані вхідні двері
      <br />підніміться на 4й поверх`;

const renderByFootTab = () => (
  <div className="flex flex-col pt-2 pb-4 xl:flex-row-reverse">
    <p className="mb-4 w-full flex-1 xl:w-3/5 xl:pl-2">
      <img
        className="aspect-[3/2] w-full bg-stone-100"
        src={imageSrcRouteFoot}
        alt="Route by foot"
      />
    </p>

    <p className="mb-4 xl:pr-2">
      <iframe
        className="aspect-[9/16] w-full"
        title="Video route by foot"
        src="https://www.youtube.com/embed/7G47r3wuoZE"
      ></iframe>
    </p>
  </div>
);

const byCarText = `
      <br />Заїзд за магазином «Фора»
      <br />спускайтесь прямо донизу
      <br />поверніть праворуч
      <br />рухайтесь прямо вздовж паркувальних місць до самого кінця
      <br />поверніть двічі праворуч між двома будівлями
      <br />за навісним цегляним переходом ліворуч розташоване наше місце для паркінгу
      <br />(escp.90), а праворуч — вхідні двері
      <br />підніміться на 4й поверх`;

const renderByCarTab = () => (
  <div className="flex flex-col pt-2 pb-4 xl:flex-row-reverse">
    <p className="mb-4 w-full flex-1 xl:w-3/5 xl:pl-2">
      <img
        className="aspect-[3/2] w-full bg-stone-100"
        src={imageSrcRouteCar}
        alt="Route by car"
      />
    </p>

    <p className="mb-4 xl:pr-2">
      <iframe
        className="aspect-[9/16] w-full"
        title="Video route by car"
        src="https://www.youtube.com/embed/9K-G9kvpRS0"
      ></iframe>
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

  // Mounted check for React Tooltip
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

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
      {/* Standalone Tooltip */}
      {hasMounted && (
        <ReactTooltip
          backgroundColor="#2b2b2b"
          textColor="#ffffff"
          place="bottom"
          effect="solid"
          multiline
        />
      )}

      <NavBar active="contacts" />

      <div className="flex w-full flex-1 flex-col font-light sm:w-3/5">
        <h1 className="mx-auto mt-8 flex w-full justify-between font-medium text-stone-900">
          Контакти
        </h1>

        <h3 className="text-center">
          <p className="mt-2">
            <a
              className="text-stone-900 underline hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://goo.gl/maps/bT3pDgCpEC1Hsvn59"
            >
              📍 Бул. Вацлава Гавела, 4.
            </a>
          </p>
          <p className="mt-4">Як нас знайти:</p>
          <p className="mb-4">
            {["Пішки", "На авто"].map((tabName, tabIndex) => {
              const isCurrentTab = +currentTab === tabIndex;
              const isFootTab = +tabIndex === 0;
              const isCarTab = +tabIndex === 1;

              return (
                <span key={tabName}>
                  {isFootTab && (
                    <span
                      className={`radius mr-2 inline-block h-[3ch] w-[3ch] cursor-pointer rounded-full bg-stone-300 text-center font-mono font-medium not-italic text-stone-100 hover:bg-stone-400 ${
                        isCurrentTab ? "" : "invisible"
                      }`}
                      data-tip={byFootText}
                    >
                      ?
                    </span>
                  )}
                  <span
                    onClick={() => setTab(`${tabIndex}`)}
                    className={`inline-block px-2 py-1 font-medium text-stone-900  ${
                      isCurrentTab
                        ? "underline"
                        : "cursor-pointer hover:text-stone-400"
                    }`}
                  >
                    {tabName}
                  </span>
                  {isCarTab && (
                    <span
                      className={`radius ml-2 inline-block h-[3ch] w-[3ch] cursor-pointer rounded-full bg-stone-300 text-center font-mono font-medium not-italic text-stone-100 hover:bg-stone-400 ${
                        isCurrentTab ? "" : "invisible"
                      }`}
                      data-tip={byCarText}
                    >
                      ?
                    </span>
                  )}
                  {tabIndex !== 1 && <span className="px-2"> | </span>}
                </span>
              );
            })}
          </p>
        </h3>

        {renderedTab}
      </div>

      <Footer />
    </main>
  );
}
