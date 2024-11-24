export default function Header({ current }: { current?: string }) {
  return (
    <h1 className="absolute top-8 flex flex-row gap-1 text-sm font-semibold text-stone-900 md:top-0 md:left-8 md:flex-col">
      <span className={`${current === "booking" ? "" : "invisible"}`}>
        <span className="hidden md:inline">бронювання</span>
      </span>
      <span className={`${current === "about" ? "" : "invisible"}`}>
        <span className="hidden md:inline">зали</span>
      </span>
      <span className={`${current === "contacts" ? "" : "invisible"}`}>
        <span className="hidden md:inline">контакти</span>
      </span>
      <span className={`${current === "rules" ? "" : "invisible"}`}>
        <span className="hidden md:inline">правила</span>
      </span>
    </h1>
  );
}
