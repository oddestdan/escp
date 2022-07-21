const baseClass = "w-full py-3 px-4";
const filledClass =
  "bg-stone-800 text-stone-100 hover:bg-stone-700 focus:bg-stone-500";
const invertedClass =
  "border-2 border-stone-800 text-stone-800 hover:text-stone-200 hover:bg-stone-800 focus:bg-stone-500 focus:border-stone-500";

export const ActionButton: React.FC<
  {
    inverted?: boolean;
    buttonType?: "button" | "submit" | "reset" | undefined;
  } & React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
> = ({ inverted = false, buttonType, ...props }) => (
  <button
    {...props}
    type={buttonType}
    className={
      `${baseClass} ${inverted ? invertedClass : filledClass} ` +
        props.className || ""
    }
  >
    {props.children}
  </button>
);
