export const sendSMS = async (startDate: Date, recipientPhone: string) => {
  const URL = process.env.SMS_URL;
  const API_KEY = process.env.SMS_API_KEY;
  const DOMAIN = process.env.SMS_DOMAIN;

  if (!URL || !startDate) {
    return;
  }

  const date = startDate.toLocaleDateString("uk");
  const time = startDate.toLocaleTimeString("uk", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Kyiv",
  });
  const textMessage = `Біп-біп!
Нагадуємо про ваше бронювання ${date} о ${time}.

Як нас знайти (бул. Вацлава Гавела, 4): ${DOMAIN}/contacts?tab=0 
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
