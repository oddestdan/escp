import { Link } from "@remix-run/react";
import {
  // CalendarIcon,
  // CameraIcon,
  // ExclamationCircleIcon,
  // MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
// import {
//   CalendarIcon as CalendarIconSolid,
//   CameraIcon as CameraIconSolid,
//   ExclamationCircleIcon as ExclamationCircleIconSolid,
//   MapPinIcon as MapPinIconSolid,
// } from "@heroicons/react/24/solid";

const SideNav = ({
  isOpen,
  close,
  active,
}: {
  isOpen: boolean;
  close: () => void;
  active?: string;
}) => {
  return (
    <nav
      className={`fixed -top-2 -right-2 z-50 h-[22rem] w-[26ch] transform bg-white py-10 px-3 text-stone-900 shadow-xl transition-all duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex w-full justify-end px-4">
        <button
          type="button"
          onClick={close}
          className="h-9 w-9 p-1 text-xl font-medium"
        >
          <XMarkIcon />
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-2 font-normal">
        <Link
          to="/booking"
          className={`mr-2 flex flex-row-reverse items-center gap-[10px]  py-2 pl-4 pr-4 hover:text-stone-400 ${
            active === "booking" ? "bg-stone-800 text-white" : ""
          }`}
        >
          {/* {active === "booking" ? (
            <CalendarIconSolid className="h-8 w-8 text-xl" />
          ) : (
            <CalendarIcon className="h-8 w-8 text-xl" />
          )} */}
          бронювання
        </Link>
        <Link
          to="/about"
          className={`mr-2 flex flex-row-reverse items-center gap-[10px]  py-2 pl-4 pr-4 hover:text-stone-400 ${
            active === "about" ? "bg-stone-800 text-white" : ""
          }`}
        >
          {/* {active === "about" ? (
            <CameraIconSolid className="h-8 w-8 text-xl" />
          ) : (
            <CameraIcon className="h-8 w-8 text-xl" />
          )} */}
          зали
        </Link>
        <Link
          to="/contacts"
          className={`mr-2 flex flex-row-reverse items-center gap-[10px]  py-2 pl-4 pr-4 hover:text-stone-400 ${
            active === "contacts" ? "bg-stone-800 text-white" : ""
          }`}
        >
          {/* {active === "contacts" ? (
            <MapPinIconSolid className="h-8 w-8 text-xl" />
          ) : (
            <MapPinIcon className="h-8 w-8 text-xl" />
          )} */}
          контакти
        </Link>
        <Link
          to="/rules"
          className={`mr-2 flex flex-row-reverse items-center gap-[10px]  py-2 pl-4 pr-4 hover:text-stone-400 ${
            active === "rules" ? "bg-stone-800 text-white" : ""
          }`}
        >
          {/* {active === "rules" ? (
            <ExclamationCircleIconSolid className="h-8 w-8 text-xl" />
          ) : (
            <ExclamationCircleIcon className="h-8 w-8 text-xl" />
          )} */}
          правила
        </Link>
      </div>
    </nav>
  );
};

export default SideNav;
