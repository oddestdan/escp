interface NumberPickerProps {
  selectedNumber?: number;
  setNumber: (n: string) => void;
  maxNumber?: number;
  displayHint?: boolean;
}

const NumberPicker = ({
  setNumber,
  selectedNumber = 1,
  maxNumber = 4,
  displayHint = false,
}: NumberPickerProps) => {
  return (
    <div className="mx-3 flex items-start gap-x-4 sm:gap-x-2">
      {Array.from(Array(maxNumber).keys()).map((key) => {
        const isSelected = selectedNumber >= key + 1;
        return (
          <div className="flex w-16 flex-col items-center sm:w-20" key={key}>
            <button
              type="button"
              onClick={() => setNumber(String(key + 1))}
              className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm sm:h-12  sm:w-12  ${
                isSelected
                  ? "bg-stone-800 text-stone-100 hover:border-stone-400 hover:text-stone-400 focus:border-stone-200 focus:text-stone-200"
                  : "border-stone-800 text-stone-800 hover:border-stone-400 hover:text-stone-400 focus:border-stone-700 focus:text-stone-700"
              }`}
            >
              {key + 1}
            </button>
            {displayHint && (
              <span className="text-sm">{key === 0 ? "0 грн" : "+50 грн"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NumberPicker;
