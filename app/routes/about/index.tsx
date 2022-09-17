import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";
import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { ABOUT_PAGE_PARAM } from "~/utils/pageParams";

// import { ls } from "~/utils/localStorage.service";
// const lsCurrentTab = "current_tab";

// const imageSrcRoute = "https://i.imgur.com/kb7520L.png";
const imageSrcRoute = "https://i.imgur.com/2hX0UrQ.png";
const galleryImages = [
  "https://i.imgur.com/KxlfINW.jpg",
  "https://i.imgur.com/2gUgtbh.jpg",
  "https://i.imgur.com/XcwX5jr.jpg",
  "https://i.imgur.com/YYAubFa.jpg",
  "https://i.imgur.com/29AZC8j.jpg",
  "https://i.imgur.com/INmYrJG.jpg",
];

const renderTab0 = () => (
  <>
    <p className="mb-4">
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
        // className="mb-4 aspect-[27/12] w-full flex-1 bg-stone-100 xl:w-1/2"
        className="mb-4 aspect-[3/2] w-full flex-1 bg-stone-100 xl:w-1/2"
        src={imageSrcRoute}
        alt="Route"
      />

      <p className="mb-4 xl:pr-32">
        Прохідна з сірими воротами ліворуч від "Silver Centre"
        <br />
        <br />
        {"-> "}йдіть прямо вниз до останнього корпусу
        <br />
        {"-> "}перед ним ліворуч та з правого боку будуть вхідні двері
        <br />
        {"-> "}підіймайтесь на 4й поверх та знайдіть нас
      </p>
    </span>

    <p className="mb-4 mt-8 text-left xl:text-center">
      <span className="mb-2 block">
        Телеграм:{" "}
        <a
          className="mb-2 text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://t.me/escp90"
        >
          https://t.me/escp90
        </a>
      </span>
      <span className="mb-2 block">
        Інстаграм:{" "}
        <a
          className="mb-2 text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://www.instagram.com/escp.90/"
        >
          https://www.instagram.com/escp.90/
        </a>
      </span>
    </p>
  </>
);

const renderTab1 = () => (
  <>
    <p className="mb-4">Фотостудія 90 м², бул. Вацлава Гавела 4</p>
    <div className="mb-4 flex flex-col-reverse justify-between lg:flex-row">
      <div className="mb-4 mt-4 w-full lg:mt-0 lg:w-1/3">
        Що входить у вартість та який є реквізит:
        {/* desktop/left-side mobile/bottom*/}
        <ul className="">
          {[
            "2 світла godox fv150",
            "чорно-білі прапори",
            "бумажні фони",
            "вентилятор",
            "диван на коліщатках",
            "стільці",
            "крісло",
            "стіл на коліщатках",
            "дзеркало",
            "матрац",
            "килим",
            "блекаут штори",
            "колонка jbl",
            "пульверизатор",
            "відпарювач",
            "гардероб",
          ].map((good) => (
            <li key={good} className="list-inside list-[decimal-leading-zero]">
              {good}
            </li>
          ))}
        </ul>
      </div>

      {/* desktop/right-side mobile/top*/}
      <div className="w-full lg:w-2/3 lg:pl-4">
        {/* https://www.npmjs.com/package/react-image-gallery */}
        <ImageGallery
          items={galleryImages.map((img) => ({
            original: img,
            thumbnail: img,
          }))}
          showPlayButton={false}
          slideDuration={200}
        />
      </div>
    </div>
  </>
);

export default function About() {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  console.log(searchParams.get(ABOUT_PAGE_PARAM));
  const [currentTab, setCurrentTab] = useState(
    () => searchParams.get(ABOUT_PAGE_PARAM) || "0" // ls.getItem(lsCurrentTab, "0")
  );

  const setTab = (tab: string) => {
    // ls.setItem(lsCurrentTab, tab);
    setCurrentTab(tab);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="about" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="about" />

        <div className="mx-auto mb-4 flex w-full flex-col sm:w-3/5">
          <h2 className="my-4 text-center font-mono">
            {["контакти", "вартість та реквізит"].map((tabName, tabIndex) => (
              <span key={tabName}>
                <span
                  onClick={() => setTab(`${tabIndex}`)}
                  className={`cursor-pointer text-stone-900 hover:text-stone-400 ${
                    currentTab == `${tabIndex}` ? "font-medium" : "underline"
                  }`}
                >
                  {tabName}
                </span>
                {tabIndex === 0 && " | "}
              </span>
            ))}
          </h2>
          {currentTab === "0" ? renderTab0() : renderTab1()}
        </div>
      </div>

      <Footer />
    </main>
  );
}
