import type { Appointment } from "@prisma/client";
import crypto from "crypto";
import type { StudioInfo } from "~/components/BookingStep/Steps/StudioStep";
import type { ContactInfo } from "~/store/bookingSlice";
import { KYIV_LOCALE, KYIV_TIME_ZONE, STUDIO_ID_QS } from "~/utils/constants";
import { studiosData } from "~/utils/studiosData";

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

// TODO: https://wiki.wayforpay.com/view/852102
export async function generateAppointmentPaymentData({
  id,
  price,
  timeFrom,
  timeTo,
  contactInfo,
  studio,
}: Pick<
  Appointment,
  "id" | "contactInfo" | "price" | "timeFrom" | "timeTo" | "studio"
>) {
  const isDev = Boolean(process.env.IS_DEV);

  const info: ContactInfo = JSON.parse(contactInfo);
  const parsedStudio: StudioInfo = JSON.parse(studio);
  const studioId =
    studiosData.findIndex((s) => s.name === parsedStudio.name) || 0;
  const returnUrl = `${
    isDev ? "http://localhost:3000" : "https://escp90.studio"
  }/WayForPay/${id}?${STUDIO_ID_QS}=${studioId}`;
  const data = {
    merchantAccount: merchantAccount,
    merchantDomainName: merchantDomainName,
    merchantTransactionSecureType: "AUTO",
    // sends a POST request to this url instead of a regular redirect
    returnUrl,
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
    paymentSystems: "card;googlePay;applePay;privat24;qrCode",
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
    .createHmac("md5", merchantSecretKey || `flk3409refn54t54t*FNJRET`)
    .update(hashString)
    .digest("hex");
  data.merchantSignature = hash;

  return data;
}
