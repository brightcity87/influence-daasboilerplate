import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";

export default function useCopyBlocker(allowCopy: boolean) {
  const toast = useToast();

  const handleCopy = useCallback(
    (e: ClipboardEvent) => {
      if (!allowCopy) {
        e.preventDefault();
        toast.closeAll();
        toast({
          title: "Copy not allowed",
          description: "Your current plan doesn't include data copying functionality",
          status: "warning",
          duration: 3000,
        });
      }
    },
    [allowCopy, toast]
  );
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!allowCopy) {
        e.preventDefault();
      }
    },
    [allowCopy]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!allowCopy && (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))
      )) {
        e.preventDefault();
      }
    },
    [allowCopy]
  );
  useEffect(() => {
    if (!allowCopy) {
      document.addEventListener("copy", handleCopy);
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("copy", handleCopy);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleCopy, handleContextMenu, handleKeyDown, allowCopy]);

  return { handleCopy, handleContextMenu, handleKeyDown };
}
