const baseClass = "w-full py-3 px-4 font-regular";
export const filledClass =
  "bg-stone-800 border-2 border-stone-800 text-stone-100 hover:bg-stone-700 hover:border-stone-700 focus:bg-stone-500 focus:border-stone-500";
// const invertedClass =
// "border-2 border-stone-800 text-stone-800 hover:text-stone-200 hover:bg-stone-800 focus:bg-stone-500 focus:border-stone-500";
export const invertedClass =
  "border-2 border-stone-800 text-stone-800 hover:border-stone-400 hover:text-stone-400 focus:text-stone-700 focus:border-stone-700";

export const ActionButton: React.FC<
  {
    inverted?: boolean;
    disabled?: boolean;
    buttonType?: "button" | "submit" | "reset" | undefined;
  } & React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
> = ({ inverted = false, disabled = false, buttonType, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    type={buttonType}
    className={`${baseClass} ${inverted ? invertedClass : filledClass} ${
      disabled
        ? "cursor-not-allowed border-transparent bg-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-200 hover:text-stone-600"
        : "cursor-pointer border-stone-800"
    } ${
      props && props.className && props.className.length > 0
        ? props?.className
        : ""
    }`}
  >
    {props.children}
  </button>
);
