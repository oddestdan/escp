export const sendSMS = async (
  roomName: string,
  formattedDateString: string,
  recipientPhone: string,
  confirmationId?: string | null
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
    !confirmationId?.length
  ) {
    return;
  }

  const textMessage = `Біп-біп!
Нагадуємо про ваше бронювання зали ${roomName} ${formattedDateString}.

Як нас знайти (бул. Вацлава Гавела, 4): ${DOMAIN}/contacts
Детальніше про бронювання: ${DOMAIN}/booking/confirmation/${confirmationId}

Чекаємс!`;

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
