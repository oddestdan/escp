import ImageGallery from "react-image-gallery";
import { useCallback } from "react";
import { useSearchParams } from "@remix-run/react";

import { STUDIO_ID_QS } from "~/utils/constants";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";
import Wrapper from "~/components/Wrapper/Wrapper";
import { studiosDataArr } from "./about.constant";

export default function About() {
  const [searchParams, setSearchParams] = useSearchParams();
  const studioId = searchParams.get(STUDIO_ID_QS) || undefined;
  const studio = studiosDataArr[Number(studioId)];

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
                studiosData={studiosDataArr.map(({ data }) => data)}
                selectedStudioIndex={-1}
                onSaveStudio={onSaveStudio}
                highlightable // as both can be selected for /about
                tileOnly
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
