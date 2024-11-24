import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { InstagramIcon, TelegramIcon } from "~/icons";
import { getIsMobile } from "~/utils/breakpoints";
import {
  ADMIN_FORMATTED_PHONE_NO,
  ADMIN_PLAIN_PHONE_NO,
  NUMBER_COPIED_MSG,
} from "~/utils/constants";
import useCopyClipboard from "~/utils/hooks/useCopyClipboard.hook";

const phoneNo = {
  plain: ADMIN_PLAIN_PHONE_NO,
  formatted: ADMIN_FORMATTED_PHONE_NO,
};

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
    <div className="mb-2 flex h-full w-full flex-row flex-wrap items-center justify-between gap-2 text-center text-sm font-light md:mb-0 md:flex-col md:items-end md:justify-end">
      {/* Clickable phone number to call immediately */}
      {/* <span className="mt-4 flex w-full justify-center md:mt-0 md:w-auto">
        <a href="tel:+380636857636">+38 (063) 685 76 36</a>
      </span> */}
      {/* Clickable copy-paste phone number */}
      <span className="relative justify-center whitespace-nowrap">
        <span
          className={`radius absolute -top-8 px-2 py-1 text-center text-sm text-stone-900 shadow-md ${
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
      <span className="flex justify-center">
        <SocialIcons isMobile={isMobile} />
      </span>
      <span className="hidden flex-1 items-end justify-center md:inline-flex">
        <span className="min-w-fit">made by</span>
        <Link
          to="https://www.instagram.com/oddestdan"
          target="_blank"
          className={`ml-1 text-stone-900 hover:text-stone-400`}
        >
          @oddestdan
        </Link>
      </span>
    </div>
  );
}
