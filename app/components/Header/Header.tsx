export default function Header({ current }: { current?: string }) {
  return (
    <h1 className="mx-auto flex w-full justify-between font-mono font-light text-stone-900 sm:w-3/5">
      <span
        className={`${
          current === "escp" ? "font-medium" : "invisible"
        } mx-0.5 flex-1 p-0.5 text-left`}
      >
        escp.90
      </span>
      <span
        className={`${
          current === "booking" ? "font-medium" : "invisible"
        } mx-0.5 flex-1 p-0.5 text-center`}
      >
        бронювання
      </span>
      <span
        className={`${
          current === "about" ? "font-medium" : "invisible"
        } mx-0.5 flex-1 p-0.5 text-right`}
      >
        про студію
      </span>
    </h1>
  );
}
