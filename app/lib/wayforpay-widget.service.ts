import type { generateAppointmentPaymentData } from "./wayforpay.service";

// NOTE: DEPRECATED
// NOTE: DEPRECATED
// NOTE: DEPRECATED
// NOTE: DEPRECATED
// NOTE: DEPRECATED

export const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT;
export const merchantDomainName = process.env.WFP_MERCHANT_DOMAIN_NAME;
export const merchantSecretKey = process.env.WFP_MERCHANT_SECRET_KEY;

// export const loadScript = () => {
//   const script = document.createElement("script");
//   script.src = "https://secure.wayforpay.com/server/pay-widget.jsx";
//   script.async = true;
//   return script;
// };

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

// https://wiki.wayforpay.com/view/852091
export const wayforpay = function (
  wfpConstructor: any,
  paymentData: Awaited<ReturnType<typeof generateAppointmentPaymentData>>
) {
  if (!wfpConstructor) return;

  const wayforpay = new wfpConstructor();

  wayforpay.run(
    { ...paymentData },
    function (response: any) {
      console.log("on approved");
    },
    function (response: any) {
      console.log("on declined");
    },
    function (response: any) {
      console.log("on pending or in processing");
    }
  );
};
