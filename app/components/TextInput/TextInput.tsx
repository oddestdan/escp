const baseClass =
  "block w-full px-2 py-2 bg-white border border-stone-300 placeholder-stone-400";
const statesClass =
  "focus:outline-none focus:border-stone-700 focus:ring-1 focus:ring-stone-700";
const disabledClass = "disabled:bg-stone-50 disabled:text-stone-500";

export const TextInput: React.FC<any> = (props) => (
  <input
    {...props}
    className={
      `${baseClass} ${statesClass} ${disabledClass} ` + props.className || ""
    }
  />
);
