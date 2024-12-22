import { useEffect, useState } from "react";

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  canLoadMore: boolean;
  fetchNextPage: () => void;
  count: number;
}

export const useChatScroll = ({ chatRef, bottomRef, canLoadMore, fetchNextPage, count }: ChatScrollProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const topDiv = chatRef.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && canLoadMore) {
        setTimeout(() => {
          fetchNextPage();
        }, 1000);
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);

    return () => topDiv?.removeEventListener("scroll", handleScroll);
  }, [chatRef, fetchNextPage, canLoadMore]);

  useEffect(() => {
    const bottomDiv = bottomRef.current;
    const topDiv = chatRef.current;

    const autoScroll = () => {
      if (isInitialized && bottomDiv) {
        setIsInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (autoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [bottomRef, chatRef, isInitialized, count]);
};
