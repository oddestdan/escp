export default function Header({ current }: { current: string }) {
  return (
    <h1 className="mx-auto flex w-full justify-between text-stone-900 sm:w-3/5">
      <span
        className={`${
          current === "escp" ? "font-bold" : "invisible"
        } mx-0.5 p-0.5`}
      >
        escp.90
      </span>
      <span
        className={`${
          current === "rules" ? "font-bold" : "invisible"
        } mx-0.5 p-0.5`}
      >
        правила
      </span>
      <span
        className={`${
          current === "about" ? "font-bold" : "invisible"
        } mx-0.5 p-0.5`}
      >
        про нас
      </span>
      <span
        className={`${
          current === "booking" ? "font-bold" : "invisible"
        } mx-0.5 p-0.5`}
      >
        букінг
      </span>
    </h1>
  );
}
