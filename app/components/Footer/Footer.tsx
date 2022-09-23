import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { InstagramIcon, TelegramIcon } from "~/icons";
import { TikTokIcon } from "~/icons/TikTokIcon";
import { getIsMobile } from "~/utils/breakpoints";

const Separator = () => <span className="px-2">|</span>;

const SocialIcons = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <span className="block">
      <a
        className="text-stone-900 underline hover:text-stone-400"
        target="_blank"
        rel="noreferrer"
        href="https://t.me/escp90/"
      >
        <TelegramIcon
          height={isMobile ? "36px" : "24px"}
          width={isMobile ? "36px" : "24px"}
        />
      </a>
    </span>
    <span className={`${isMobile ? "ml-4" : "ml-2"} block`}>
      <a
        className="text-stone-900 underline hover:text-stone-400"
        target="_blank"
        rel="noreferrer"
        href="https://www.instagram.com/escp.90/"
      >
        <InstagramIcon
          height={isMobile ? "36px" : "24px"}
          width={isMobile ? "36px" : "24px"}
        />
      </a>
    </span>
    <span className={`${isMobile ? "ml-4" : "ml-2"} block`}>
      <a
        className="text-stone-900 underline hover:text-stone-400"
        target="_blank"
        rel="noreferrer"
        href="https://www.tiktok.com/@escp90/"
      >
        <TikTokIcon
          height={isMobile ? "36px" : "24px"}
          width={isMobile ? "36px" : "24px"}
        />
      </a>
    </span>
  </>
);

export default function Footer() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  return (
    <div className="mt-4 flex w-full flex-wrap justify-center text-center font-light">
      <Link
        to="/contacts"
        className={`font-mono text-stone-900 underline hover:text-stone-400`}
      >
        контакти
      </Link>
      <Separator />
      <Link
        to="/rules"
        className={`font-mono text-stone-900 underline hover:text-stone-400`}
      >
        правила
      </Link>
      <Separator />
      <a href="https://savelife.in.ua/donate/" target="_blank" rel="noreferrer">
        🇺🇦
      </a>
      {!isMobile && <Separator />}
      <span className={`flex justify-center ${isMobile ? "mt-4 w-full" : ""}`}>
        <SocialIcons isMobile={isMobile} />
      </span>
    </div>
  );
}
