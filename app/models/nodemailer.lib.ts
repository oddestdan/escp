import nodemailer from "nodemailer";
import { KYIV_LOCALE } from "~/utils/constants";

interface MailOptions {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
}

export const transporter = nodemailer.createTransport({
  secure: true,
  port: 2525,
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = (
  overrideMailOptions: MailOptions,
  studioName: string
) => {
  const defaultMailOptions: MailOptions = {
    from: `"escp.90-site" <${process.env.SMTP_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Новий запис ${studioName} | ${new Date().toLocaleString(
      KYIV_LOCALE
    )}`,
  };

  transporter.sendMail(
    { ...defaultMailOptions, ...overrideMailOptions },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`> Email sent: ${info.response}`);
      }
    }
  );
};
