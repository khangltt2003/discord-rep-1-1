"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberProfile } from "@/type";
import { Member } from "@prisma/client";
import { ChevronUp, Hash, Loader, Loader2, MessageCircle, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useEffect, useRef, useCallback, useState } from "react";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";

interface ChatMessagesProps {
  currentMember: Member;
  name: string;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChannelMessages = ({ currentMember, name, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const queryKey = `chat:${chatId}`;
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  const updateKey = `channel-${chatId}-update-messages`;
  const addKey = `channel-${chatId}-new-messages`;

  const chatRef = useRef<ElementRef<"div">>(null);

  useChatSocket({ queryKey, addKey, updateKey });

  const handleScroll = useCallback(() => {
    const container = chatRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const previousHeight = container.scrollHeight;
      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - previousHeight;
        });
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const container = chatRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // scroll to the bottom on initial load
  useEffect(() => {
    if (chatRef.current && firstLoad) {
      setFirstLoad(false);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [data, firstLoad]);

  if (status === "pending") {
    return (
      <div className="flex-1 w-full h-12 flex flex-col items-center justify-center text-neutral-300">
        <Loader className="text-neutral-300 animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 w-full h-12 flex flex-col items-center justify-center text-neutral-300">
        <ServerCrash />
        <p>Internal Server Error</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col overflow-y-auto pt-4 px-2">
      {!hasNextPage && <div className="flex-1" />}
      <div className="relative">
        {!hasNextPage && (
          <div className="p-2">
            <div className="h-16 w-16 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
              {type === "channel" && <Hash className="text-neutral-300 h-10 w-10" />}
              {type === "conversation" && <MessageCircle className="text-neutral-300 h-10 w-10" />}
            </div>
            <p className="text-3xl font-bold text-neutral-300 mb-10">
              {type === "channel" ? "Welcome to # " + name : "Now both of you can talk whatever you want."}
            </p>
          </div>
        )}
        {hasNextPage && (
          <div className="sticky top-0 w-full flex items-center justify-center ">
            {isFetchingNextPage ? (
              <Loader className="h-6 w-6 text-neutral-200 animate-spin" />
            ) : (
              <div className="bg-zinc-700 rounded-full px-4 py-2 flex gap-1 z-50 animate-bounce">
                <p className="text-neutral-300">scroll up to view older messages</p>
                <ChevronUp />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col-reverse gap-2">
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.messages.map((message: MessageWithMemberProfile) => (
                <ChatItem socketUrl={socketUrl} socketQuery={socketQuery} key={message.id} currentMember={currentMember} message={message} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
