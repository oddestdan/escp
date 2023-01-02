import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";

import highq1 from "../../../public/images/highq/1.jpg";
import highq2 from "../../../public/images/highq/2.jpg";
import highq3 from "../../../public/images/highq/3.jpg";
import highq4 from "../../../public/images/highq/4.jpg";
import highq5 from "../../../public/images/highq/5.jpg";
import highq6 from "../../../public/images/highq/6.jpg";
import highq7 from "../../../public/images/highq/7.jpg";
import highq8 from "../../../public/images/highq/8.jpg";

import lowq1 from "../../../public/images/lowq/1.jpg";
import lowq2 from "../../../public/images/lowq/2.jpg";
import lowq3 from "../../../public/images/lowq/3.jpg";
import lowq4 from "../../../public/images/lowq/4.jpg";
import lowq5 from "../../../public/images/lowq/5.jpg";
import lowq6 from "../../../public/images/lowq/6.jpg";
import lowq7 from "../../../public/images/lowq/7.jpg";
import lowq8 from "../../../public/images/lowq/8.jpg";

// pairs of [highQuality, lowQuality]
const galleryImages: [string, string][] = [
  [highq1, lowq1],
  [highq2, lowq2],
  [highq3, lowq3],
  [highq4, lowq4],
  [highq5, lowq5],
  [highq6, lowq6],
  [highq7, lowq7],
  [highq8, lowq8],
];

export default function About() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="about" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="about" />

        <div className="mx-auto mb-4 flex w-full flex-col sm:w-3/5">
          {/* About page content */}
          {/* <p className="my-4">Фотостудія 90 м², бул. Вацлава Гавела, 4</p> */}
          <p className="my-4">
            <span className="font-medium">90 м².</span>
            <br />
            Що входить у вартість та який є реквізит:
          </p>
          <div className="mb-4 flex flex-col-reverse justify-between lg:flex-row">
            <div className="mb-4 mt-4 w-full lg:mt-0 lg:w-1/3">
              {/* Що входить у вартість та який є реквізит: */}
              {/* desktop/left-side mobile/bottom*/}
              <ul className="">
                {[
                  "блекаут штори",
                  "диван на коліщатках",
                  "колонка jbl",
                  "стіл на коліщатках",
                  "стільці",
                  "два світла godox fv150",
                  "чорно-білі прапори",
                  [
                    "гардероб",
                    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTI5OTQwMTg4NjM0ODE1?igshid=MDJmNzVkMjY",
                  ],
                  "килим",
                  "бумажні фони",
                  "матрац",
                  "крісло",
                  "вентилятор",
                  "дзекрало",
                  "пульверизатор",
                  "відпарювач",
                  "фрост рама",
                ].map((good: string | string[]) => (
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
            </div>

            {/* desktop/right-side mobile/top*/}
            <div className="w-full lg:w-2/3 lg:pl-4">
              {/* https://www.npmjs.com/package/react-image-gallery */}
              <ImageGallery
                items={galleryImages.map(([high, low]) => ({
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
      </div>

      <Footer />
    </main>
  );
}
