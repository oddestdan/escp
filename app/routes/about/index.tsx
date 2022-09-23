import NavBar from "~/components/NavBar/NavBar";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import ImageGallery from "react-image-gallery";

// pairs of [highQuality, lowQuality]
const galleryImages: [string, string][] = [
  ["https://i.imgur.com/Ew6LphX.png", "https://i.imgur.com/ianw6jB.jpg"],
  ["https://i.imgur.com/boXCkOq.png", "https://i.imgur.com/efUOarL.jpg"],
  ["https://i.imgur.com/0ch3UKH.png", "https://i.imgur.com/nSuRR73.jpg"],
  ["https://i.imgur.com/Kt5h5f7.jpg", "https://i.imgur.com/pRnsIFP.jpg"],
  ["https://i.imgur.com/xt1Vk9V.jpg", "https://i.imgur.com/BIcRzEx.jpg"],
  ["https://i.imgur.com/c7vgeH5.jpg", "https://i.imgur.com/fgKCST5.jpg"],
  ["https://i.imgur.com/RAsweOZ.jpg", "https://i.imgur.com/I0M8E06.jpg"],
  ["https://i.imgur.com/ANcgQzX.jpg", "https://i.imgur.com/vY55BrZ.jpg"],
];

export default function About() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
      <NavBar active="about" />

      <div className="flex w-full flex-1 flex-col font-light">
        <Header current="about" />

        <div className="mx-auto mb-4 flex w-full flex-col sm:w-3/5">
          {/* About page content */}
          <p className="my-4">Фотостудія 90 м², бул. Вацлава Гавела 4</p>
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
                  <li
                    key={good}
                    className="list-inside list-[decimal-leading-zero]"
                  >
                    {good}
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
