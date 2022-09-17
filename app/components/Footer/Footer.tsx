import { Link } from "@remix-run/react";
import { InstagramIcon, TelegramIcon } from "~/icons";

export default function Footer() {
  return (
    <div className="mt-4 flex justify-center text-center font-light">
      <Link
        to="/rules"
        className={`font-mono text-stone-900 underline hover:text-stone-400`}
      >
        правила
      </Link>

      <span className="px-2">|</span>

      <a href="https://savelife.in.ua/donate/" target="_blank" rel="noreferrer">
        🇺🇦
      </a>

      <span className="px-2">|</span>

      <span className="block">
        <a
          className="text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://t.me/escp90"
        >
          <TelegramIcon height="24px" width="24px" />
        </a>
      </span>
      <span className="ml-2 block">
        <a
          className="text-stone-900 underline hover:text-stone-400"
          target="_blank"
          rel="noreferrer"
          href="https://www.instagram.com/escp.90/"
        >
          <InstagramIcon height="24px" width="24px" />
        </a>
      </span>
    </div>
  );
}
