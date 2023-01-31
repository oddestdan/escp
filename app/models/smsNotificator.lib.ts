export const sendSMS = async (
  formattedDateString: string,
  recipientPhone: string
) => {
  const URL = process.env.SMS_URL;
  const API_KEY = process.env.SMS_API_KEY;
  const DOMAIN = process.env.SMS_DOMAIN;

  if (!URL || !formattedDateString?.length) {
    return;
  }

  const textMessage = `Біп-біп!
Нагадуємо про ваше бронювання ${formattedDateString}.

Як нас знайти (бул. Вацлава Гавела, 4): ${DOMAIN}/contacts
Детальніше про бронювання: ${DOMAIN}/booking/confirmation/du6j1aoev675avg7krcqiqi2ng

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
            source: "InfoCenter", // TODO: "escp.90",
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
