import { ADMIN_PAYMENT_CARD, NUMBER_COPIED_MSG } from "~/utils/constants";
import useCopyClipboard from "~/utils/hooks/useCopyClipboard.hook";

export const CopyableCard: React.FC<any> = () => {
  const [hasCopied, copyToClipboard] = useCopyClipboard(ADMIN_PAYMENT_CARD);

  return (
    <>
      <p className="flex justify-center">
        <input
          className={`inline w-pcard cursor-text border-2 border-stone-900 bg-stone-100 py-2 px-2 text-center text-stone-900`}
          defaultValue={ADMIN_PAYMENT_CARD}
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
        {NUMBER_COPIED_MSG}
      </p>
    </>
  );
};
