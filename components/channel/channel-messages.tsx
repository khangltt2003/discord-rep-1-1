"use client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberProfile } from "@/type";
import { Member } from "@prisma/client";
import { ChevronUp, Hash, Loader, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useEffect, useRef, useCallback, useState } from "react";
import { ChatItem } from "./channel-chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { ChatWelCome } from "../chat/chat-welcome";

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
  const bottomRef = useRef<ElementRef<"div">>(null);
  useChatSocket({ queryKey, addKey, updateKey });

  const handleScroll = useCallback(() => {
    const chatDiv = chatRef.current;
    if (!chatDiv) return;

    if (chatDiv.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const previousHeight = chatDiv.scrollHeight;
      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          chatDiv.scrollTop = chatDiv.scrollHeight - previousHeight;
        });
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const chatDiv = chatRef.current;
    if (chatDiv) {
      chatDiv.addEventListener("scroll", handleScroll);
      return () => chatDiv.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // scroll to the bottom on initial load
  useEffect(() => {
    const chatDiv = chatRef.current;
    const bottomDiv = bottomRef.current;

    if (!chatDiv || !bottomDiv) return;

    if (firstLoad) {
      setFirstLoad(false);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      return;
    }
    if (chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 200) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <ChatWelCome name={name} type="channel" hasNextPage={hasNextPage} />
        {hasNextPage && (
          <div className="sticky top-0 w-full flex items-center justify-center ">
            {isFetchingNextPage ? (
              <Loader className="h-6 w-6 text-neutral-200 animate-spin" />
            ) : (
              <div className="bg-zinc-700  rounded-full px-4 py-2 flex gap-1 z-50 animate-bounce">
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
                <ChatItem
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                  key={message.id}
                  currentMember={currentMember}
                  message={message}
                  type={type}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
