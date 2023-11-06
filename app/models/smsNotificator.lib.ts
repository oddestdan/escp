interface SMSError {
  code: string;
  date: string;
  description: string;
}

interface SMSResponse {
  success: number;
  // good
  date?: string;
  data?: any;
  // bad
  error?: SMSError;
}

export const sendSMS = async (
  roomName: string,
  formattedDateString: string,
  recipientPhone: string,
  confirmationId?: string | null,
  studioId?: number
) => {
  const URL = process.env.SMS_URL;
  const API_KEY = process.env.SMS_API_KEY;
  const DOMAIN = process.env.SMS_DOMAIN;
  const SOURCE = process.env.SMS_SOURCE_NAME;

  console.log({
    URL,
    SOURCE,
    API_KEY,
    DOMAIN,
    roomName,
    formattedDateString,
    confirmationId,
    studioId,
  });

  if (
    !URL ||
    !SOURCE ||
    !API_KEY ||
    !DOMAIN ||
    !roomName?.length ||
    !formattedDateString?.length ||
    !confirmationId?.length ||
    studioId === undefined
  ) {
    return;
  }

  // Детальніше про бронювання: ${DOMAIN}/booking/confirmation/${confirmationId}?${STUDIO_ID_QS}=${studioId}
  const textMessage = `Біп-біп!
Нагадуємо про бронювання зали ${roomName} ${formattedDateString}.
Як нас знайти: ${DOMAIN}/contacts
Чекаємс!`;

  console.log("------- SENDING SMS -------");
  try {
    const response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        auth: {
          key: API_KEY,
        },
        action: "SENDMESSAGE",
        data: {
          recipient: `${Number(recipientPhone)}`,
          channels: ["sms"],
          sms: {
            source: SOURCE,
            ttl: 5,
            text: textMessage,
          },
        },
      }),
    });

    const result: SMSResponse = await response.json();
    console.log({ textMessage, result });

    if (!result) throw new Error("Invalid SMS result");

    if (result.success !== 1 && result.error)
      throw new Error(
        `SMS Failed with error ${result.error.code}: ${result.error.description} `
      );
  } catch (error) {
    console.error("error", error);
  }
};
