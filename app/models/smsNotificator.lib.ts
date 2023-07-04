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

  if (
    !URL ||
    !SOURCE ||
    !API_KEY ||
    !DOMAIN ||
    !roomName?.length ||
    !formattedDateString?.length ||
    !confirmationId?.length ||
    !studioId
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

    const result = await response.text();
    console.log({ textMessage, result });

    if (!result) throw new Error("Invalid SMS result");
  } catch (error) {
    console.error("error", error);
  }
};
