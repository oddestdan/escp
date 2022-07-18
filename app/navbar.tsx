import { Link } from "@remix-run/react";

export default function NavBar({ active }: { active: string }) {
  return (
    <nav className="my-4 mx-auto flex w-full flex-row justify-between font-light sm:w-3/5">
      <Link
        to="/escp"
        className={`mx-0.5 p-0.5 text-stone-900 hover:text-stone-400 ${
          active === "escp" ? "invisible" : "underline"
        }`}
      >
        escp.90
      </Link>
      <Link
        to="/rules"
        className={`mx-0.5 p-0.5 text-stone-900 hover:text-stone-400 ${
          active === "rules" ? "invisible" : "underline"
        }`}
      >
        правила
      </Link>
      <Link
        to="/about"
        className={`mx-0.5 p-0.5 text-stone-900 hover:text-stone-400 ${
          active === "about" ? "invisible" : "underline"
        }`}
      >
        про нас
      </Link>
      <Link
        to="/booking"
        className={`mx-0.5 p-0.5 text-stone-900 hover:text-stone-400 ${
          active === "booking" ? "invisible" : "underline"
        }`}
      >
        букінг
      </Link>
    </nav>
  );
}
