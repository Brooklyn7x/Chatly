import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollBehavior() {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } =
          scrollContainerRef.current;
        setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100);
      }
    };

    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  });

  return { isNearBottom, scrollContainerRef, scrollToBottom };
}
