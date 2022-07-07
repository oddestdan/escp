import { Link } from "@remix-run/react";

export default function NavBar({ active }: { active: string }) {
  return (
    <nav className="my-4 flex w-full flex-row justify-between font-light">
      <Link
        to="/escp"
        className={`text-stone-900 hover:text-stone-400 ${
          active === "escp" ? "font-bold" : "underline"
        }`}
      >
        escp.90
      </Link>
      <Link
        to="/rules"
        className={`text-stone-900 hover:text-stone-400 ${
          active === "rules" ? "font-bold" : "underline"
        }`}
      >
        правила
      </Link>
      <Link
        to="/about"
        className={`text-stone-900 hover:text-stone-400 ${
          active === "about" ? "font-bold" : "underline"
        }`}
      >
        про нас
      </Link>
      <Link
        to="/booking"
        className={`text-stone-900 hover:text-stone-400 ${
          active === "booking" ? "font-bold" : "underline"
        }`}
      >
        бронювання
      </Link>
    </nav>
  );
}
