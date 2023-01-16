import { useCallback, useEffect } from "react";

export const useWFPWidgetListener = (closeCb: () => void) => {
  const handlePostMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data == "WfpWidgetEventClose") {
        closeCb();
      }
    },
    [closeCb]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("message", handlePostMessage);
    return () => window.removeEventListener("message", handlePostMessage);
  }, [handlePostMessage]);
};
