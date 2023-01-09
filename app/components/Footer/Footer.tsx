import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { InstagramIcon, TelegramIcon } from "~/icons";
import { TikTokIcon } from "~/icons/TikTokIcon";
import { getIsMobile } from "~/utils/breakpoints";
import {
  ADMIN_FORMATTED_PHONE_NO,
  ADMIN_PLAIN_PHONE_NO,
  CONTACTS_CURRENT_TAB_PARAM,
  NUMBER_COPIED_MSG,
} from "~/utils/constants";
import useCopyClipboard from "~/utils/hooks/useCopyClipboard.hook";

const phoneNo = {
  plain: ADMIN_PLAIN_PHONE_NO,
  formatted: ADMIN_FORMATTED_PHONE_NO,
};
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

  const [hasCopiedPhoneNo, copyPhoneNoToClipboard] = useCopyClipboard(
    phoneNo.plain
  );

  return (
    <div className="mt-4 flex w-full flex-wrap justify-center text-center font-light">
      <Link
        to={`/contacts?${CONTACTS_CURRENT_TAB_PARAM}=0`}
        className={`text-stone-900 underline hover:text-stone-400`}
      >
        контакти
      </Link>
      <Separator />
      <Link
        to="/rules"
        className={`text-stone-900 underline hover:text-stone-400`}
      >
        правила
      </Link>
      <Separator />
      <a href="https://savelife.in.ua/donate/" target="_blank" rel="noreferrer">
        🇺🇦
      </a>
      <span className="hidden md:inline">
        <Separator />
      </span>
      <span className="mt-4 flex w-full justify-center md:mt-0 md:w-auto">
        <SocialIcons isMobile={isMobile} />
      </span>
      <span className="hidden md:inline">
        <Separator />
      </span>
      {/* Clickable phone number to call immediately */}
      {/* <span className="mt-4 flex w-full justify-center md:mt-0 md:w-auto">
        <a href="tel:+380636857636">+38 (063) 685 76 36</a>
      </span> */}
      {/* Clickable copy-paste phone number */}
      <span className="relative mt-4 inline-block flex w-full justify-center md:mt-0 md:w-auto">
        <span
          className={`radius absolute -top-8 bg-stone-100 px-2 py-1 text-center text-sm text-stone-900 ${
            hasCopiedPhoneNo ? "" : "invisible"
          }`}
        >
          {NUMBER_COPIED_MSG}
        </span>
        <span
          className="cursor-pointer hover:text-stone-400 active:text-stone-300"
          onClick={copyPhoneNoToClipboard}
        >
          {phoneNo.formatted}
        </span>
      </span>
    </div>
  );
}
