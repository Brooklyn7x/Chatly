import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollBehavior() {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } =
          scrollContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        console.log(distanceFromBottom);
        setIsNearBottom(distanceFromBottom < 100);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return { isNearBottom, scrollContainerRef, scrollToBottom };
}
