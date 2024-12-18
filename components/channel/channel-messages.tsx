"use client";

import { Member } from "@prisma/client";
import { ChatWelcome } from "../chat-welcome";
import { Hash, Loader, MessageCircle, MessagesSquare, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Message } from "postcss";

interface ChatMessagesProps {
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

export const ChannelMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
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
  const messages: Message[] = data ? data.pages[0].messages : [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto border  p-4">
      <div className="flex-1" />
      <div>
        <div className="h-14 w-14 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
          {type === "channel" && <Hash className="text-neutral-300 h-10 w-10" />}
          {type === "conversation" && <MessageCircle className=" text-neutral-300 h-10 w-10" />}
        </div>
        <p className="text-2xl font-bold text-neutral-300">
          {type === "channel" ? "Welcome to #" + name : "Now both of you can talk whatever you want."}
        </p>

        <div className="flex flex-col-reverse ">
          {messages.map((message) => {
            return (
              <div key={message.id} className="w-full mt-1 hover:bg-slate-400 ">
                {message.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
