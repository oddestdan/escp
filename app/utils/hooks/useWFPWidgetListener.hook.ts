import { useCallback, useEffect } from "react";

export const useWFPWidgetListener = (
  patchCb: () => void,
  postCb: () => void,
  hasPaid = false
) => {
  const handlePostMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data === "WfpWidgetEventClose") {
        console.log("Widget close");
        !hasPaid && patchCb();
      } else if (event.data === "WfpWidgetEventApproved") {
        console.log("Payment successful, widget approved");
        if (hasPaid) return;
        // patchCb();
        postCb();
      } else if (event.data === "WfpWidgetEventPending") {
        console.log("Widget pending");
      } else if (event.data === "WfpWidgetEventDeclined") {
        console.log("Widget declined");
      }
    },
    [patchCb, postCb, hasPaid]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("message", handlePostMessage);
    return () => window.removeEventListener("message", handlePostMessage);
  }, [handlePostMessage]);
};
