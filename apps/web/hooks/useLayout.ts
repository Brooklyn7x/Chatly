import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUiStore";
import { useCallback, useEffect } from "react";

export function useLayout() {
  const { isMobile, setIsMobile } = useUIStore();
  const { activeChatId } = useChatStore();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, [setIsMobile]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return {
    isMobile,
    activeChatId,
  };
}
