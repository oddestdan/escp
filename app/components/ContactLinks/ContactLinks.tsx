import { InstagramIcon, TelegramIcon } from "~/icons";

export const ContactLinks: React.FC = () => {
  return (
    <>
      <span className="flex items-center">
        Телеграм:{" "}
        <a
          className="ml-1 text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://t.me/escp90"
        >
          <TelegramIcon height="32px" width="32px" />
        </a>
      </span>
      <span className="ml-4 flex items-center">
        Інстаграм:{" "}
        <a
          className="ml-1 text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://www.instagram.com/escp.90/"
        >
          <InstagramIcon height="32px" width="32px" />
        </a>
      </span>
    </>
  );
};
