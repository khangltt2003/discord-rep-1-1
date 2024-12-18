"use client";

import { Member, Profile } from "@prisma/client";
import { Hash, Loader, MessageCircle, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Fragment } from "react";
import { MessageWithMemberProfile } from "@/type";
import { ChatItem } from "../chat-item";

interface ChatMessagesProps {
  currentMember: Member;
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChannelMessages = ({
  currentMember,
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  if (status == "pending") {
    return (
      <div className="flex-1 w-full h-12 flex flex-col items-center justify-center text-neutral-300">
        <Loader className="text-neutral-300 animate-spin" />
      </div>
    );
  }

  if (status == "error") {
    return (
      <div className="flex-1 w-full h-12 flex flex-col items-center justify-center text-neutral-300">
        <ServerCrash />
        <p>Internal Server Error</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pt-4  px-2">
      <div className="flex-1" />
      <div>
        <div className="p-2">
          <div className="h-16 w-16 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
            {type === "channel" && <Hash className="text-neutral-300 h-10 w-10" />}
            {type === "conversation" && <MessageCircle className=" text-neutral-300 h-10 w-10" />}
          </div>
          <p className="text-3xl font-bold text-neutral-300 mb-10">
            {type === "channel" ? "Welcome to # " + name : "Now both of you can talk whatever you want."}
          </p>
        </div>

        <div className="flex flex-col-reverse">
          {data?.pages.map((page, i) => {
            return (
              <Fragment key={i}>
                {page.messages.map((message: MessageWithMemberProfile) => {
                  return <ChatItem key={message.id} currentMember={currentMember} message={message} />;
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
