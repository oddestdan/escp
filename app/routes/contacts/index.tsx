import { useSearchParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { CONTACTS_CURRENT_TAB_QS } from "~/utils/constants";
import ReactTooltip from "react-tooltip";

import imageSrcRouteFoot from "../../../public/images/route-foot.jpg";
import imageSrcRouteCar from "../../../public/images/route-car.jpg";
import Wrapper from "~/components/Wrapper/Wrapper";

const byFootText = `
      <br />Прохідна за магазином "Фора"
      <br />йдіть прямо та поверніть праворуч в арку
      <br />за аркою трохи лівіше та продовжуйте йти прямо між двома будівлями
      <br />в кінці будівель ліворуч та ще раз ліворуч
      <br />за навісним переходом між будівлями праворуч наші вхідні двері
      <br />піднімайтесь на 4й поверх`;
const byFootLink =
  "https://www.youtube.com/embed/JqN3QQpe8K8?rel=0&showinfo=0&autohide=1";
// "https://www.youtube.com/embed/jbK3TkREKY0?rel=0&showinfo=0&autohide=1";

const renderByFootTab = () => (
  <div className="flex flex-col flex-nowrap items-stretch justify-center pt-2 pb-4 xl:flex-row-reverse">
    <div className="mb-4 w-full xl:w-3/5 xl:pl-2">
      <img
        className="aspect-[2/2] h-[40vh] bg-stone-100 object-cover md:h-[50vh] xl:h-[60vh] 2xl:h-[70vh]"
        src={imageSrcRouteFoot}
        alt="Route by foot"
      />
    </div>

    <div className="mb-4 xl:pr-2 ">
      <iframe
        className="youtube-iframe aspect-[9/16] h-[40vh] w-full bg-stone-100 md:h-[50vh] xl:h-[60vh] 2xl:h-[70vh]"
        title="Video route by foot"
        src={byFootLink}
      ></iframe>
    </div>
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
const byCarLink =
  "https://www.youtube.com/embed/86ykAtLvo8Y?si=Wa54MKEPm3llD0-c";
// "https://www.youtube.com/embed/2XAhrZxe2rA?si=Wa54MKEPm3llD0-c";

const renderByCarTab = () => (
  <div className="flex flex-col flex-nowrap items-stretch justify-center pt-2 pb-4 xl:flex-row-reverse">
    <p className="mb-4 w-full flex-1 xl:w-3/5 xl:pl-2">
      <img
        className="aspect-[2/2] h-[40vh] bg-stone-100 object-cover md:h-[50vh] xl:h-[60vh] 2xl:h-[70vh]"
        src={imageSrcRouteCar}
        alt="Route by car"
      />
    </p>

    <p className="mb-4 xl:pr-2">
      <iframe
        className="youtube-iframe aspect-[9/16] h-[40vh] w-full bg-stone-100 md:h-[50vh] xl:h-[60vh] 2xl:h-[70vh]"
        title="Video route by car"
        src={byCarLink}
      ></iframe>
    </p>
  </div>
);

export default function Contacts() {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(
    () =>
      searchParams.get(CONTACTS_CURRENT_TAB_QS) ||
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
    <Wrapper activePage="contacts">
      {/* Standalone Tooltip */}
      {hasMounted && (
        <ReactTooltip
          backgroundColor="#2b2b2b"
          textColor="#ffffff"
          place={currentTab === "0" ? "right" : "left"}
          effect="solid"
          multiline
        />
      )}

      <div className="mx-auto flex w-full flex-1 flex-col items-center justify-start font-light md:max-w-[80%]">
        <h3 className="text-center">
          <p className="mb-2">
            Як нас знайти:{" "}
            <a
              className="text-stone-900 underline underline-offset-2 hover:text-stone-400"
              target="_blank"
              rel="noreferrer"
              href="https://maps.app.goo.gl/arzErU4Hb5Q4kAUC9"
            >
              {/* 📍 Бул. Вацлава Гавела, 4. */}
              бул. Вацлава Гавела, 4.
            </a>
          </p>
          <p className="mb-4 flex items-center justify-between gap-1">
            <span
              className={`radius mr-2 inline-block h-[1.5rem] w-[1.5rem] cursor-pointer rounded-full bg-stone-300 text-center font-medium not-italic text-stone-100 hover:bg-stone-400 ${
                currentTab === "0" ? "" : "invisible"
              }`}
              data-tip={byFootText}
            >
              ?
            </span>
            <ul className="relative flex list-none flex-wrap px-1.5 py-1.5">
              <li className="z-30 flex-auto text-center">
                <button
                  type="button"
                  className={`z-30 mb-0 flex w-full items-center justify-center border-2 px-6 py-2 text-sm ${
                    currentTab === "0"
                      ? "cursor-default border-transparent bg-stone-800 text-stone-100"
                      : "border-stone-800 hover:border-stone-500 hover:text-stone-500"
                  }`}
                  role="tab"
                  aria-selected={currentTab === "0"}
                  onClick={() => setTab(`0`)}
                >
                  пішки
                </button>
              </li>
              <li className="z-30 flex-auto text-center">
                <button
                  type="button"
                  className={`z-30 mb-0 flex w-full items-center justify-center border-2 px-6 py-2 text-sm ${
                    currentTab === "1"
                      ? "cursor-default border-transparent bg-stone-800 text-stone-100"
                      : "border-stone-800 hover:border-stone-500 hover:text-stone-500"
                  }`}
                  role="tab"
                  aria-selected={currentTab === "1"}
                  onClick={() => setTab(`1`)}
                >
                  на авто
                </button>
              </li>
            </ul>
            <span
              className={`radius ml-2 inline-block h-[1.5rem] w-[1.5rem] cursor-pointer rounded-full bg-stone-300 text-center font-medium not-italic text-stone-100 hover:bg-stone-400 ${
                currentTab === "1" ? "" : "invisible"
              }`}
              data-tip={byCarText}
            >
              ?
            </span>
          </p>
        </h3>

        {renderedTab}
      </div>
    </Wrapper>
  );
}
