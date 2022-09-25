import { Link } from "@remix-run/react";

export default function NavBar({ active }: { active?: string }) {
  return (
    <nav className="mx-auto mt-4 flex w-full flex-row justify-between font-mono font-light sm:w-3/5">
      <Link
        to="/escp"
        className={`mx-0.5 p-0.5 p-0.5 text-stone-900 hover:text-stone-400 md:flex-1 md:text-left ${
          active === "escp" ? "invisible" : "underline"
        }`}
      >
        escp.90
      </Link>
      <Link
        to="/booking"
        className={`mx-0.5 p-0.5 p-0.5 text-stone-900 hover:text-stone-400 md:flex-1 md:text-center ${
          active === "booking" ? "invisible" : "underline"
        }`}
      >
        бронювання
      </Link>
      <Link
        to="/about"
        className={`mx-0.5 p-0.5 p-0.5 text-stone-900 hover:text-stone-400 md:flex-1 md:text-right ${
          active === "about" ? "invisible" : "underline"
        }`}
      >
        про студію
      </Link>
    </nav>
  );
}
