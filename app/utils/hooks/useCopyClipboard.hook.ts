import { useState, useCallback } from "react";

export default function useCopyClipboard(
  text: string,
  timeoutResettable = true
): [boolean, () => void] {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setHasCopied(true);

    timeoutResettable && setTimeout(() => setHasCopied(false), 2000);
  }, [text, timeoutResettable]);

  return [hasCopied, copyToClipboard];
}
