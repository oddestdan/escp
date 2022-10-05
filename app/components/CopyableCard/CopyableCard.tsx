import { useCallback, useState } from "react";

const paymentInfo = "4149 6090 1440 7540";

export const CopyableCard: React.FC<any> = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(paymentInfo.replace(/\s/g, ""));
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  }, []);

  return (
    <>
      <p className="flex justify-center">
        <input
          className={`inline w-pcard cursor-text border-2 border-stone-900 bg-stone-100 py-2 px-2 text-center text-stone-900`}
          defaultValue={paymentInfo}
          readOnly={true}
        />
        <button
          className="inline cursor-pointer border-2 border-l-0 border-stone-900 py-2 px-2 text-stone-900 text-stone-900 hover:border-stone-400 hover:text-stone-400"
          onClick={copyToClipboard}
        >
          скопіювати
        </button>
      </p>
      <p
        className={`mt-1 mb-4 text-center text-sm ${
          hasCopied ? "" : "invisible"
        }`}
      >
        номер скопійовано!
      </p>
    </>
  );
};
