/* eslint-disable @typescript-eslint/no-unused-vars */
import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import { useCallback } from "react";

import highq1_Numbered1 from "../../../public/images/highq/r1/реквізит/1.png";
import highq1_Numbered2 from "../../../public/images/highq/r1/реквізит/2.png";
import highq1_1 from "../../../public/images/highq/r1/1.jpg";
import highq1_2 from "../../../public/images/highq/r1/2.jpg";
import highq1_3 from "../../../public/images/highq/r1/3.jpg";
import highq1_4 from "../../../public/images/highq/r1/4.jpg";
import highq1_5 from "../../../public/images/highq/r1/5.jpg";
import highq1_6 from "../../../public/images/highq/r1/6.jpg";

import highq2_Numbered1 from "../../../public/images/highq/r2/реквізит/1.png";
import highq2_Numbered2 from "../../../public/images/highq/r2/реквізит/2.png";
import highq2_1 from "../../../public/images/highq/r2/1.jpg";
import highq2_2 from "../../../public/images/highq/r2/2.jpg";
import highq2_3 from "../../../public/images/highq/r2/3.jpg";
import highq2_4 from "../../../public/images/highq/r2/4.jpg";

import lowres1_1 from "../../../public/images/lowres/r1 (1).jpg";
import lowres1_2 from "../../../public/images/lowres/r1 (2).jpg";
import lowres2_1 from "../../../public/images/lowres/r2 (1).jpg";
import lowres2_2 from "../../../public/images/lowres/r2 (2).jpg";
import Wrapper from "~/components/Wrapper/Wrapper";

// pairs of [highQuality, lowQuality]
const gallery1Images: [string, string][] = [
  [highq1_Numbered1, highq1_Numbered1],
  [highq1_Numbered2, highq1_Numbered2],
  // [highq1_3, highq1_3],
  [highq1_4, highq1_4],
  [highq1_5, highq1_5],
  [highq1_6, highq1_6],
];

const room1Items = [
  "диван на коліщатках",
  "паперові фони",
  "лавка",
  "вентилятор",
  "стіл",
  "крісло",
  "дзеркало",
  "столик на коліщатках",
  "флет з фанери",
  "стільці",
  "драбина",
  "матрац",
  "дерев'яний ящик",
  "тканини",
  "рейл для одягу",
  "колонка jbl",
  "пульверизатор",
  "відпарювач",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "чорно-білі прапори",
  "фрост рама 1,5х2 м",
  "два спалахи godox qs-600 та один godox qs-400",
  "два постійних світла: godox litemons la200d та la200bis",
  "софтбокси, зонт на просвіт, кольорові фільтри",
];
const Studio1Description = () => (
  <p className="my-4">
    <p className="font-medium">room1</p>
    <br />
    <p className="font-medium">90 м²</p>
    <br />
    Зала з бетонною підлогою. 4 великих деревʼяних вікна, виходять на південь.
    <br />
    Блекаут штори.
    <br />
    Можна встановити на стійки паперовий фон на вибір.
    <br />
    В залі є пересувний флет з фанери.
    <br />
    Висота стель 4,3 м
    <br />
    <br />
    Що входить у вартість та який є реквізит:
  </p>
);

const gallery2Images: [string, string][] = [
  [highq2_Numbered1, highq2_Numbered1],
  [highq2_Numbered2, highq2_Numbered2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
];
const room2Items = [
  "вентилятор",
  "дерев'яний ящик",
  "лавка",
  "драбина",
  "стіл на коліщатках",
  "дзеркало",
  "диван на коліщатках",
  "стільці",
  "паперові фони: чорний, сірий та оливковий",
  "матрац",
  "рейл для одягу",
  "пульверизатор",
  "відпарювач",
  "колонка jbl",
  [
    "гардероб",
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
  ],
  "чорно-білі прапори",
  "фрострама 1,8x1,8 м",
  "три спалахи profoto d1 500air",
  "два постійних світла: godox litemons la200d та la200bi",
  "софтбокси, портретна тарілка для profoto, зонт на просвіт, кольорові фільтри",
];
const Studio2Description = () => (
  <p className="my-4">
    <p className="font-medium">room 2</p>
    <br />
    <p className="font-medium">90 м²</p>
    <br />
    Зала з циклорамою та паркетом. 4 великих деревʼяних вікна, виходять на
    південь.
    <br />
    Блекаут штори.
    <br />
    Три паперових фони закріплені на стіні: чорний, сірий та оливковий.
    <br />
    Розмір циклорами 7,3 x 5,7 м
    <br />
    Висота стель 4,3 м
    <br />
    <br />
    Що входить у вартість та який є реквізит:
  </p>
);

const room1Data = {
  images: gallery1Images,
  items: room1Items,
  Description: Studio1Description,
  Additional: () => (
    <p className="my-4">
      Також додатково на зйомку можна орендувати два постійних світла aputure
      600d
      <br />
      1 год - 250 грн/шт
      <br />
      від 3х год - 650 грн/шт
    </p>
  ),
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
  Additional: () => (
    <p className="my-4">
      Також додатково на зйомку можна орендувати два постійних світла aputure
      600d
      <br />
      1 год - 250 грн/шт
      <br />
      від 3х год - 650 грн/шт
    </p>
  ),
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
    <Wrapper activePage="about">
      <div className="flex h-full w-full flex-1 flex-col justify-center font-light">
        {studioId === undefined ? (
          <div className="flex w-full flex-1 flex-col items-center font-light">
            <div className="mb-4 mt-1 w-[90%]">
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

            <div className="mb-4 flex flex-col-reverse justify-between xl:flex-row">
              <div className="mb-4 mt-4 w-full xl:mt-0 xl:w-1/3">
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
              <div className="w-full xl:w-2/3 xl:pl-4">
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
    </Wrapper>
  );
}
