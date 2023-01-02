export default function Header({ current }: { current?: string }) {
  return (
    <h1 className="mx-auto flex w-full justify-between font-light text-stone-900 sm:w-3/5">
      <span
        className={`${
          current === "escp" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5 md:flex-1 md:text-left`}
      >
        escp.90
      </span>
      <span
        className={`${
          current === "booking" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5 md:flex-1 md:text-center`}
      >
        бронювання
      </span>
      <span
        className={`${
          current === "about" ? "font-medium" : "invisible"
        } mx-0.5 p-0.5 md:flex-1 md:text-right`}
      >
        про студію
      </span>
    </h1>
  );
}
