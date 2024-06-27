import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { useCallback } from "react";

import highq1_Numbered1 from "../../../public/images/highq/numbered/room1 (1).png";
import highq1_Numbered2 from "../../../public/images/highq/numbered/room1 (2).png";
import highq1_1 from "../../../public/images/highq/r1 (1).jpg";
import highq1_2 from "../../../public/images/highq/r1 (2).jpg";
import highq1_3 from "../../../public/images/highq/r1 (3).jpg";
import highq1_4 from "../../../public/images/highq/r1 (4).jpg";
import highq1_5 from "../../../public/images/highq/r1 (5).jpg";

import highq2_Numbered1 from "../../../public/images/highq/numbered/room2 (1).png";
import highq2_Numbered2 from "../../../public/images/highq/numbered/room2 (2).png";
import highq2_1 from "../../../public/images/highq/r2 (1).jpg";
import highq2_2 from "../../../public/images/highq/r2 (2).jpg";
import highq2_3 from "../../../public/images/highq/r2 (3).jpg";
import highq2_4 from "../../../public/images/highq/r2 (4).jpg";
import highq2_5 from "../../../public/images/highq/r2 (5).jpg";

import lowres1_1 from "../../../public/images/highq/lowres/r1 (1).jpg";
import lowres1_2 from "../../../public/images/highq/lowres/r1 (2).jpg";
import lowres2_1 from "../../../public/images/highq/lowres/r2 (1).jpg";
import lowres2_2 from "../../../public/images/highq/lowres/r2 (2).jpg";

// pairs of [highQuality, lowQuality]
const gallery1Images: [string, string][] = [
  [highq1_Numbered1, highq1_Numbered1],
  [highq1_Numbered2, highq1_Numbered2],
  [highq1_3, highq1_3],
  [highq1_4, highq1_4],
  [highq1_5, highq1_5],
];

const room1Items = [
  "дзеркало",
  "диван на коліщатках",
  "паперові фони",
  "блекаут штори",
  "вентилятор",
  "стільці",
  "дерев'яний злет",
  "стіл на коліщатках",
  "тканини",
  "матрац",
  "крісло",
  "дерев'яний ящик",
  "лавка",
  "драбина",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "рейл для одягу",
  "колонка jbl",
  "чорно-білі прапори",
  "пульверизатор",
  "відпарювач",
  "фрост рама",
  "два постійних світла godox fv150 та один спалах godox qs-600ii",
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
  [highq2_Numbered1, highq2_Numbered1],
  [highq2_Numbered2, highq2_Numbered2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
  [highq2_5, highq2_5],
];
const room2Items = [
  "блекаут штори",
  "вентилятор",
  "дерев'яна лавка ",
  "дерев'яний ящик",
  "драбина",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "рейл для одягу",
  "дзеркало",
  "стіл на коліщатках",
  "диван на коліщатках",
  "стільці",
  "паперові фони: чорний, сірий та оливковий",
  "колонка jbl",
  "чорно-білі прапори",
  "пульверизатор",
  "відпарювач",
  "два постійних світла godox litemons la200d та один спалах godox qs-600ii",
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
  Additional: () => null,
  data: {
    img: highq1_1,
    name: "room 1",
    area: 90,
    altImg: highq1_2,
    lowres: {
      img: lowres1_1,
      altImg: lowres1_2,
    },
  },
};

const room2Data = {
  images: gallery2Images,
  items: room2Items,
  Description: Studio2Description,
  Additional: () => null,
  // Additional: () => (
  //   <p className="my-4">Зараз в цьому залі відсутнє студійне світло!</p>
  // ),
  data: {
    img: highq2_1,
    name: "room 2",
    area: 90,
    altImg: highq2_2,
    lowres: {
      img: lowres2_1,
      altImg: lowres2_2,
    },
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
                selectedStudioIndex={-1}
                onSaveStudio={onSaveStudio}
                highlightable // as both can be selected for /about
                vertical
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
