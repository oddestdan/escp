import { useEffect, useRef, useState } from "react";
import Header from "~/header";
import NavBar from "~/navbar";

const image1Src = "https://i.imgur.com/2gUgtbh.jpg";
const image2Src = "https://i.imgur.com/XcwX5jr.jpg";

export const useImageLoaded = () => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const onLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad();
    }
  });

  return [ref, loaded, onLoad];
};

export default function Escp() {
  // const [image1Ref, image1Loaded, onImage1Load] = useImageLoaded();
  // const [image2Ref, image2Loaded, onImage2Load] = useImageLoaded();

  return (
    <div className="flex w-full justify-center">
      <main className="flex w-full flex-col items-center p-4 font-mono">
        <NavBar active="escp" />

        <div className="flex w-full flex-col font-light">
          <Header current="escp" />

          <div className="mx-auto flex flex-col sm:w-3/5">
            <img
              // className={`my-4 w-full ${!image1Loaded && "bg-stone-100"}`}
              // ref={image1Ref}
              // onLoad={onImage1Load}
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
              // className={`my-4 w-full ${!image2Loaded && "bg-stone-100"}`}
              // ref={image2Ref}
              // onLoad={onImage2Load}
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
