import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";

import highq1_Numbered1 from "../../public/images/highq/r1/реквізит/1.png";
import highq1_Numbered2 from "../../public/images/highq/r1/реквізит/2.png";
import highq1_1 from "../../public/images/highq/r1/1.jpg";
import highq1_2 from "../../public/images/highq/r1/2.jpg";
// import highq1_3 from "../../public/images/highq/r1/3.jpg";
import highq1_4 from "../../public/images/highq/r1/4.jpg";
import highq1_5 from "../../public/images/highq/r1/5.jpg";
import highq1_6 from "../../public/images/highq/r1/6.jpg";

import highq2_Numbered1 from "../../public/images/highq/r2/реквізит/1.png";
import highq2_Numbered2 from "../../public/images/highq/r2/реквізит/2.png";
import highq2_1 from "../../public/images/highq/r2/1.jpg";
import highq2_2 from "../../public/images/highq/r2/2.jpg";
import highq2_3 from "../../public/images/highq/r2/3.jpg";
import highq2_4 from "../../public/images/highq/r2/4.jpg";

import lowres1_1 from "../../public/images/lowres/r1 (1).jpg";
import lowres1_2 from "../../public/images/lowres/r1 (2).jpg";
import lowres2_1 from "../../public/images/lowres/r2 (1).jpg";
import lowres2_2 from "../../public/images/lowres/r2 (2).jpg";

export const studiosData: StudioInfo[] = [
  {
    img: highq1_1,
    name: "room 1",
    shortName: "r1",
    area: 90,
    altImg: highq1_2,
    lowres: {
      img: lowres1_1,
      altImg: lowres1_2,
    },
  },
  {
    img: highq2_1,
    name: "room 2",
    shortName: "r2",
    area: 90,
    altImg: highq2_2,
    lowres: {
      img: lowres2_1,
      altImg: lowres2_2,
    },
  },
  {
    img: highq2_1, // TODO: get proper images
    name: "room 3",
    shortName: "r3",
    area: 45,
    altImg: highq2_2, // TODO: get proper images
    lowres: {
      img: lowres2_1, // TODO: get proper images
      altImg: lowres2_2, // TODO: get proper images
    },
  },
];

// pairs of [highQuality, lowQuality]
export const gallery1ImagesNumbered: [string, string][] = [
  [highq1_Numbered1, highq1_Numbered1],
  [highq1_Numbered2, highq1_Numbered2],
  // [highq1_3, highq1_3],
  [highq1_4, highq1_4],
  [highq1_5, highq1_5],
  [highq1_6, highq1_6],
];
export const gallery2ImagesNumbered: [string, string][] = [
  [highq2_Numbered1, highq2_Numbered1],
  [highq2_Numbered2, highq2_Numbered2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
];
export const gallery3ImagesNumbered: [string, string][] = [
  [highq2_Numbered1, highq2_Numbered1], // TODO: add images
  [highq2_Numbered2, highq2_Numbered2], // TODO: add images
  [highq2_3, highq2_3], // TODO: add images
  [highq2_4, highq2_4], // TODO: add images
];

export const gallery1Images: [string, string][] = [
  [highq1_1, highq1_1],
  [highq1_2, highq1_2],
  // [highq1_3, highq1_3],
  [highq1_4, highq1_4],
  [highq1_5, highq1_5],
  [highq1_6, highq1_6],
];
export const gallery2Images: [string, string][] = [
  [highq2_1, highq2_1],
  [highq2_2, highq2_2],
  [highq2_3, highq2_3],
  [highq2_4, highq2_4],
];
export const gallery3Images: [string, string][] = [
  [highq2_1, highq2_1], // TODO: add images
  [highq2_2, highq2_2], // TODO: add images
  [highq2_3, highq2_3], // TODO: add images
  [highq2_4, highq2_4], // TODO: add images
];

export const studiosImagesNumbered = [
  gallery1ImagesNumbered,
  gallery2ImagesNumbered,
  gallery3ImagesNumbered,
];
export const studiosImages = [gallery1Images, gallery2Images, gallery3Images];

export const studioColorCodesMap = {
  [studiosData[0].name]: "2",
  [studiosData[1].name]: "10",
  [studiosData[2].name]: "5",
};
