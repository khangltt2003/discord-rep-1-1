import { Hash, MessageCircle } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  name: string;
  type: "conversation" | "channel";
  hasNextPage: boolean;
}

export const ChatWelCome = ({ name, type, hasNextPage }: ChatWelcomeProps) => {
  if (hasNextPage) return null;
  return (
    <div className="p-2">
      <div className="h-16 w-16 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
        {type === "channel" && <Hash className="text-neutral-300 h-10 w-10" />}
        {type === "conversation" && <MessageCircle className="text-neutral-300 h-10 w-10" />}
      </div>
      <p className="text-3xl font-bold text-neutral-300 mb-10">{type === "channel" ? "Welcome to # " + name : "Now, you can chat with " + name}</p>
    </div>
  );
};
