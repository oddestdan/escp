import Header from "~/header";
import NavBar from "~/navbar";

const image1Src = "https://i.imgur.com/2gUgtbh.jpg";
const image2Src = "https://i.imgur.com/XcwX5jr.jpg";

export default function Escp() {
  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col items-center p-4 font-mono">
        <NavBar active="escp" />

        <div className="flex w-full flex-col font-light">
          <Header current="escp" />

          <div className="mx-auto flex flex-col sm:w-3/5">
            <img
              className="my-4 w-full bg-stone-100"
              src={image1Src}
              alt="Hall front"
            />
            <p className="my-4">
              90 sq m for rent.
              <br />
              фото студія, бул. Вацлава Гавела 4.
            </p>
            <img
              className="my-4 w-full bg-stone-100"
              src={image2Src}
              alt="Hall back"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
