import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { useCallback } from "react";

import highq1_1 from "../../../public/images/highq/1-1.jpg";
import highq1_2 from "../../../public/images/highq/1-2.jpg";
import highq1_4861 from "../../../public/images/highq/1-4861.jpg";
import highq1_4863 from "../../../public/images/highq/1-4863.jpg";

import highq2_1 from "../../../public/images/highq/2-1.jpg";
import highq2_2 from "../../../public/images/highq/2-2.jpg";
import highq2_4854 from "../../../public/images/highq/2-4854.jpg";
import highq2_4857 from "../../../public/images/highq/2-4857.jpg";
import highq2_4864 from "../../../public/images/highq/2-4864.jpg";
import highq2_4865 from "../../../public/images/highq/2-4865.jpg";

import imageSrcStudio1Front from "../../../public/images/highq/1-4860.jpg";
import imageSrcStudio1Back from "../../../public/images/highq/1-4862.jpg";
import imageSrcStudio2Front from "../../../public/images/highq/2-4855.jpg";
import imageSrcStudio2Back from "../../../public/images/highq/2-4851.jpg";

// pairs of [highQuality, lowQuality]
const gallery1Images: [string, string][] = [
  [highq1_1, highq1_1],
  [highq1_2, highq1_2],
  [highq1_4863, highq1_4863],
  [highq1_4861, highq1_4861],
];

const room1Items = [
  "дзекрало",
  "крісло",
  "паперові фони",
  "блекаут штори",
  "стільці",
  "вентилятор",
  "драбина",
  "стіл на коліщатках",
  "диван на коліщатках",
  "матрац",
  "два постійних світла godox fv150 та один спалах godox qs-600ii",
  "фрост рама",
  "чорно-білі прапори",
  "килим",
  "рейл для одягу",
  "чорна та біла тканини",
  "колонка jbl",
  "пульверизатор",
  "відпарювач",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
];
const Studio1Description = () => (
  <p className="my-4">
    <span className="font-medium">room1, 90 м².</span>
    <br />
    Вікна виходять на південну сторону
    <br />
    Що входить у вартість та який є реквізит:
  </p>
);

const gallery2Images: [string, string][] = [
  [highq2_1, highq2_1],
  [highq2_2, highq2_2],
  [highq2_4865, highq2_4865],
  [highq2_4864, highq2_4864],
  [highq2_4857, highq2_4857],
  [highq2_4854, highq2_4854],
];
const room2Items = [
  "блекаут штори",
  "лавка",
  "драбина",
  "рейл для одягу ",
  "стіл на коліщатках",
  "дзеркало ",
  "паперові фони: чорний та сірий",
  "диван на коліщатках",
  "стільці",
  "вентилятор",
  "колонка jbl",
  "чорно-білі прапори",
  "пульверизатор",
  "відпарювач",
  "два постійних світла godox litemons la200d та один спалах godox qs-600ii",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
];
const Studio2Description = () => (
  <p className="my-4">
    <span className="font-medium">room 2, 90 м².</span>
    <br />
    Циклорама 7х4,5м
    <br />
    Вікна виходять на південну сторону
    <br />
    Що входить у вартість та який є реквізит:
  </p>
);

const room1Data = {
  images: gallery1Images,
  items: room1Items,
  Description: Studio1Description,
  Additional: null,
  data: {
    img: imageSrcStudio1Front,
    name: "room 1",
    area: 90,
    altImg: imageSrcStudio1Back,
  },
};

const room2Data = {
  images: gallery2Images,
  items: room2Items,
  Description: Studio2Description,
  Additional: () => (
    <p className="my-4">Зараз в цьому залі відсутнє студійне світло!</p>
  ),
  data: {
    img: imageSrcStudio2Front,
    name: "room 2",
    area: 90,
    altImg: imageSrcStudio2Back,
  },
};

const studiosData: StudioInfo[] = [room1Data.data, room2Data.data];

export default function About() {
  const [searchParams, setSearchParams] = useSearchParams();
  const studioId = searchParams.get(STUDIO_ID_QS) || undefined;
  const studio = studioId === "0" ? room1Data : room2Data;

  const onSaveStudio = useCallback(
    (studioIndex) => {
      searchParams.set(STUDIO_ID_QS, `${studioIndex}`);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active={`about${studioId || ""}`} />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current={`about${studioId || ""}`} />

        {studioId === undefined ? (
          <div className="flex w-full flex-1 flex-col items-center font-light ">
            <div className="mt-12 mb-4 w-full sm:w-3/5">
              <StudioSelector
                studiosData={studiosData}
                selectedStudioIndex={0}
                onSaveStudio={onSaveStudio}
                highlightable={true} // as both can be selected for /about
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto mb-4 flex w-full flex-col sm:w-3/5">
            {/* About page content */}
            {<studio.Description />}

            <div className="mb-4 flex flex-col-reverse justify-between lg:flex-row">
              <div className="mb-4 mt-4 w-full lg:mt-0 lg:w-1/3">
                {/* desktop/left-side mobile/bottom*/}
                <ul className="">
                  {studio.items.map((good: string | string[]) => (
                    <li
                      key={typeof good === "string" ? good : good[0]}
                      className="list-inside list-[decimal-leading-zero]"
                    >
                      {typeof good === "string" ? (
                        good
                      ) : (
                        <a
                          className="text-stone-900 underline hover:text-stone-400"
                          target="_blank"
                          rel="noreferrer"
                          href={good[1]}
                        >
                          {good[0]}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>

                {studio.Additional && <studio.Additional />}
              </div>

              {/* desktop/right-side mobile/top*/}
              <div className="w-full lg:w-2/3 lg:pl-4">
                {/* https://www.npmjs.com/package/react-image-gallery */}
                <ImageGallery
                  items={studio.images.map(([high, low]) => ({
                    original: high,
                    thumbnail: low,
                  }))}
                  lazyLoad={true}
                  showPlayButton={false}
                  slideDuration={200}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
