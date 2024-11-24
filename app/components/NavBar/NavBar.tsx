import { Link } from "@remix-run/react";
import { CONTACTS_CURRENT_TAB_QS, STUDIO_ID_QS } from "~/utils/constants";
import {
  Bars2Icon,
  CalendarIcon,
  CameraIcon,
  ExclamationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import SideNav from "../SideNav/SideNav";

export default function NavBar({ active }: { active?: string }) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <>
      <nav className="z-40 hidden flex-row gap-1 text-sm font-light text-stone-900 md:absolute md:flex md:flex-col">
        <Link
          to={`/booking?${STUDIO_ID_QS}=0`}
          className={`hover:text-stone-400 ${
            active === "booking" ? "invisible" : ""
          }`}
        >
          <span className="hidden md:inline">бронювання</span>
          <div className="mx-1 h-9 w-9 p-1 text-xl font-medium md:hidden">
            <CalendarIcon />
          </div>
        </Link>
        <Link
          to="/about"
          className={`hover:text-stone-400 ${
            active === "about" ? "invisible" : ""
          }`}
        >
          <span className="hidden md:inline">зали</span>
          <div className="mx-1 h-9 w-9 p-1 text-xl font-medium md:hidden">
            <CameraIcon />
          </div>
        </Link>
        <Link
          to={`/contacts?${CONTACTS_CURRENT_TAB_QS}=0`}
          className={`hover:text-stone-400 ${
            active === "contacts" ? "invisible" : ""
          }`}
        >
          <span className="hidden md:inline">контакти</span>
          <div className="mx-1 h-9 w-9 p-1 text-xl font-medium md:hidden">
            <MapPinIcon />
          </div>
        </Link>
        <Link
          to="/rules"
          className={`hover:text-stone-400 ${
            active === "rules" ? "invisible" : ""
          }`}
        >
          <span className="hidden md:inline">правила</span>
          <div className="h-9 w-9 p-1 text-xl font-medium md:hidden">
            <ExclamationCircleIcon />
          </div>
        </Link>
      </nav>
      <div className="z-40 md:hidden">
        <button
          type="button"
          onClick={() => setIsSideNavOpen(true)}
          className="h-9 w-9 p-1 text-xl font-medium"
        >
          <Bars2Icon />
        </button>

        <SideNav
          isOpen={isSideNavOpen}
          close={() => setIsSideNavOpen(false)}
          active={active}
        />
      </div>
    </>
  );
}
