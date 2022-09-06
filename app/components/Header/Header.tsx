export default function Header({ current }: { current?: string }) {
  // TODO: Add flex-1 so that all options are aligned better
  return (
    <h1 className="mx-auto flex w-full justify-between font-mono font-light text-stone-900 sm:w-3/5">
      <span
        className={`${
          current === "escp" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5`}
      >
        escp.90
      </span>
      <span
        className={`${
          current === "booking" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5`}
      >
        бронювання
      </span>
      <span
        className={`${
          current === "about" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5`}
      >
        про студію
      </span>
    </h1>
  );
}
