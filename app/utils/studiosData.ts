import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";

// import highq1_Numbered1 from "../../public/images/highq/r1/реквізит/1.png";
// import highq1_Numbered2 from "../../public/images/highq/r1/реквізит/2.png";
import highq1_1 from "../../public/images/highq/r1/1.jpg";
import highq1_2 from "../../public/images/highq/r1/2.jpg";
import highq1_3 from "../../public/images/highq/r1/3.jpg";
import highq1_4 from "../../public/images/highq/r1/4.jpg";
// import highq1_5 from "../../public/images/highq/r1/5.jpg";
// import highq1_6 from "../../public/images/highq/r1/6.jpg";

// import highq2_Numbered1 from "../../public/images/highq/r2/реквізит/1.png";
// import highq2_Numbered2 from "../../public/images/highq/r2/реквізит/2.png";
import highq2_1 from "../../public/images/highq/r2/1.jpg";
import highq2_2 from "../../public/images/highq/r2/2.jpg";
import highq2_3 from "../../public/images/highq/r2/3.jpg";
import highq2_4 from "../../public/images/highq/r2/4.jpg";

// import highq3_Numbered1 from "../../public/images/highq/r3/реквізит/1.png";
// import highq3_Numbered2 from "../../public/images/highq/r3/реквізит/2.png";
import highq3_1 from "../../public/images/highq/r3/1.jpg";
import highq3_2 from "../../public/images/highq/r3/2.jpg";
import highq3_3 from "../../public/images/highq/r3/3.jpg";
import highq3_4 from "../../public/images/highq/r3/4.jpg";
// import highq3_5 from "../../public/images/highq/r3/5.jpg";
// import highq3_6 from "../../public/images/highq/r3/6.jpg";
// import highq3_7 from "../../public/images/highq/r3/7.jpg";

export const studiosData: StudioInfo[] = [
  {
    img: highq1_1,
    name: "room 1",
    shortName: "r1",
    area: 90,
    altImg: highq1_2,
    lowres: {
      img: highq1_1,
      altImg: highq1_2,
    },
  },
  {
    img: highq2_1,
    name: "room 2",
    shortName: "r2",
    area: 90,
    altImg: highq2_2,
    lowres: {
      img: highq2_1,
      altImg: highq2_2,
    },
  },
  {
    img: highq3_1,
    name: "room 3",
    shortName: "r3",
    area: 45,
    altImg: highq3_2,
    lowres: {
      img: highq3_1,
      altImg: highq3_2,
    },
  },
];

// pairs of [highQuality, lowQuality]
export const gallery1ImagesNumbered: [string, string][] = [
  [highq1_1, highq1_1],
  [highq1_2, highq1_2],
  [highq1_3, highq1_3],
  [highq1_4, highq1_4],
];
export const gallery2ImagesNumbered: [string, string][] = [
  [highq2_1, highq2_1],
  [highq2_2, highq2_2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
];
export const gallery3ImagesNumbered: [string, string][] = [
  [highq3_1, highq3_1],
  [highq3_2, highq3_2],
  [highq3_3, highq3_3],
  [highq3_4, highq3_4],
];

export const gallery1Images: [string, string][] = [
  [highq1_1, highq1_1],
  [highq1_2, highq1_2],
  [highq1_3, highq1_3],
  [highq1_4, highq1_4],
];
export const gallery2Images: [string, string][] = [
  [highq2_1, highq2_1],
  [highq2_2, highq2_2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
];
export const gallery3Images: [string, string][] = [
  [highq3_1, highq3_1],
  [highq3_2, highq3_2],
  [highq3_3, highq3_3],
  [highq3_4, highq3_4],
];

export const studiosImagesNumbered = [
  gallery1ImagesNumbered,
  gallery2ImagesNumbered,
  gallery3ImagesNumbered,
];
export const studiosImages = [gallery1Images, gallery2Images, gallery3Images];

export const studioColorCodesMap = ["2", "10", "5"];
export const unverifiedColorCode = "4";

export const getStudioIdByParsedInfo = (studioInfo: StudioInfo) => {
  return studiosData.findIndex((s) => s.name === studioInfo.name);
};

export const getStudioIdByInfo = (studio: string) => {
  const studioInfo: StudioInfo = JSON.parse(studio);
  return getStudioIdByParsedInfo(studioInfo);
};
