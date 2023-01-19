import { useCallback, useEffect } from "react";

export const useWFPWidgetListener = (closeCb: () => void, hasPaid = false) => {
  const handlePostMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data === "WfpWidgetEventClose") {
        console.log("Widget close");
        !hasPaid && closeCb();
      } else if (event.data === "WfpWidgetEventApproved") {
        console.log("Payment successful, widget approved");
      } else if (event.data === "WfpWidgetEventPending") {
        console.log("Widget pending");
      } else if (event.data === "WfpWidgetEventDeclined") {
        console.log("Widget declined");
      }
    },
    [closeCb, hasPaid]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("message", handlePostMessage);
    return () => window.removeEventListener("message", handlePostMessage);
  }, [handlePostMessage]);
};
