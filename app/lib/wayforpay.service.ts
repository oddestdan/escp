import type { Appointment } from "@prisma/client";
import crypto from "crypto";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import {
  IS_DEV,
  IS_POST_CREATION_FLOW,
  type ContactInfo,
} from "~/store/bookingSlice";
import { KYIV_LOCALE, KYIV_TIME_ZONE, STUDIO_ID_QS } from "~/utils/constants";
import { studiosData } from "~/utils/studiosData";

const testMerchant = {
  account: "test_merch_n1",
  domainName: "www.market.ua",
  secretKey: "flk3409refn54t54t*FNJRET",
};

export const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT;
export const merchantDomainName = process.env.WFP_MERCHANT_DOMAIN_NAME;
export const merchantSecretKey = process.env.WFP_MERCHANT_SECRET_KEY;

// const mockData = {
//   merchantAccount: "test_merch_n1",
//   merchantDomainName: "www.market.ua",
//   authorizationType: "SimpleSignature",
//   orderReference: "DH7830232x2412",
//   orderDate: "1415379863",
//   amount: "1000.00",
//   currency: "UAH",
//   productName: "Процессор Intel Core i5-4670 3.4GHz",
//   productPrice: "1000",
//   productCount: "1",
//   clientFirstName: "Вася",
//   clientLastName: "Васечкин",
//   clientEmail: "some@mail.com",
//   clientPhone: "380631234567",
//   language: "UA",
//   // generated on a string that depends on orderReference being unique
//   merchantSignature: "faecbcce0424b29e1ab22293b46d428f",
// };

export const wfpRedirectDelimeter = "__";

// TODO: https://wiki.wayforpay.com/view/852102
export async function generateAppointmentPaymentData(
  {
    id,
    price,
    timeFrom,
    timeTo,
    contactInfo,
    studio,
  }: Pick<
    Appointment,
    "id" | "contactInfo" | "price" | "timeFrom" | "timeTo" | "studio"
  >,
  preCreatedCalendarAppointmentId?: string | null
) {
  const info: ContactInfo = JSON.parse(contactInfo);
  const parsedStudio: StudioInfo = JSON.parse(studio);
  const studioId =
    studiosData.findIndex((s) => s.name === parsedStudio.name) || 0;

  const isTest = info.lastName === "test123123";

  let paymentId = id;
  if (!IS_POST_CREATION_FLOW && preCreatedCalendarAppointmentId) {
    paymentId = `${paymentId}${wfpRedirectDelimeter}${preCreatedCalendarAppointmentId}${wfpRedirectDelimeter}${studioId}`;
  }

  const data = {
    merchantAccount: isTest ? testMerchant.account : merchantAccount,
    merchantDomainName: isTest ? testMerchant.domainName : merchantDomainName,
    merchantTransactionSecureType: "AUTO",
    // sends a POST request to this url instead of a regular redirect
    returnUrl: `${
      IS_DEV ? "http://localhost:3000" : "https://escp90.studio"
    }/booking/WayForPay/${paymentId}?${STUDIO_ID_QS}=${studioId}`,
    authorizationType: "SimpleSignature",
    orderReference: `ESCP_${id}`,
    orderDate: Date.now(),
    amount: `${price}.00`,
    currency: "UAH",
    productName: `Бронювання залу "${`${parsedStudio.name}, ${parsedStudio.area} м²`}" студії escp.90 ${new Date(
      timeFrom
    ).toLocaleDateString(KYIV_LOCALE)}: ${new Date(timeFrom).toLocaleTimeString(
      KYIV_LOCALE,
      {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: KYIV_TIME_ZONE,
      }
    )}–${new Date(timeTo).toLocaleTimeString(KYIV_LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: KYIV_TIME_ZONE,
    })}`,
    productPrice: price,
    productCount: "1",
    clientFirstName: info.firstName,
    clientLastName: info.lastName || "Прізвище",
    clientEmail: "some@mail.com",
    clientPhone: info.tel,
    language: "UA",
    paymentSystems: "card;privat24;applePay;googlePay", // removed qrCode
    defaultPaymentSystem: "applePay",

    merchantSignature: "",
  };
  const hashString = [
    data.merchantAccount,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    data.productName,
    data.productCount,
    data.productPrice,
  ].join(";");

  const hash = crypto
    .createHmac(
      "md5",
      (isTest ? testMerchant.secretKey : merchantSecretKey) ||
        testMerchant.secretKey
    )
    .update(hashString)
    .digest("hex");
  data.merchantSignature = hash;

  return data;
}

export interface WayForPayPaymentResponse {
  merchantAccount: string; // 'test_merch_n1'
  merchantSignature: string; // '949cf387efb3e7bdcbc376ee09ed450c'
  orderReference: string; // 'ESCP_cm7qs83e90060ssi1bt0ebps8'
  amount: string; // '1'
  currency: string; // 'UAH'
  authCode: string; // '901456'
  email: string; // 'some@mail.com'
  phone: string; // '380983308847'
  createdDate: string; // '1740868614'
  processingDate: string; // '1740868635'
  cardPan: string; // '44****4782'
  cardType: string; // 'Visa'
  issuerBankCountry: string; // 'Ukraine'
  issuerBankName: string; // 'JSC UNIVERSAL BANK'
  recToken: string; // '674e3cf2-52e4-4a4c-9b01-00839cb36dc2'
  transactionStatus: string; // 'Approved'
  reason: string; // 'Ok'
  reasonCode: string; // '1100'
  fee: string; // '0.02'
  paymentSystem: string; // 'card'
}

export const WFP_OK_STATUS_CODE = 1100;
export const WFP_OK_ALT_STATUS_CODE = 4100;
export const WFP_ERROR_STATUS_CODE = 1101;
export const WFP_TRANSACTION_IN_PROCESSING_CODE = 1131;
export const WFP_TRANSACTION_IS_PENDING_CODE = 1134;

export const validWfpStatusCodes = [
  WFP_OK_STATUS_CODE,
  WFP_OK_ALT_STATUS_CODE,
  WFP_TRANSACTION_IN_PROCESSING_CODE,
  WFP_TRANSACTION_IS_PENDING_CODE,
];

export enum WayForPayTransaction {
  InProcessing = "InProcessing", // В обробці
  WaitingAuthComplete = "WaitingAuthComplete", // Успішний Hold
  Approved = "Approved", // Успішний платіж
  Pending = "Pending", // На перевірці Antifraud
  Expired = "Expired", // Закінчився термін оплати
  RefundedVoided = "Refunded/Voided", // Повернення
  Declined = "Declined", // Відхилений
  RefundInProcessing = "RefundInProcessing", // Повернення в обробці
}
