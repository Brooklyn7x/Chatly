import { useEffect } from "react";

export const useInfiniteScroll = (
  sentinelRef: React.RefObject<HTMLDivElement>,
  getScrollableElement: () => HTMLElement | null,
  hasMore: boolean,
  isLoading: boolean,
  loadMore: () => void
) => {
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || isLoading) return;

    const scrollable = getScrollableElement();
    if (!scrollable) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        });
      },
      {
        root: scrollable,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [getScrollableElement, hasMore, isLoading, loadMore, sentinelRef]);
};
