import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <div className="mt-4 flex justify-center text-center font-light">
      {/* TODO: Add clickable instagram/telegram icons */}
      <Link
        to="/rules"
        className={`font-mono text-stone-900 underline hover:text-stone-400`}
      >
        правила
      </Link>
      <span className="px-2">|</span>
      🇺🇦
    </div>
  );
}
