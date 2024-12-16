import React from "react";
import { ConversationTab } from "./conversation-tab";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "../ui/scroll-area";

export const ConversationSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  const conversations = await db.conversation.findMany({
    where: {
      OR: [{ memberOneId: profile.id }, { memberTwoId: profile.id }],
    },
    include: {
      memberOne: true,
      memberTwo: true,
    },
  });

  // console.log(conversations);
  return (
    <div className="h-full w-full ">
      <div
        className="w-full h-12 text-md font-semibold px-3 mb-3 flex items-center 
                            border-neutral-200 dark:border-neutral-600 border-b-2 
                          hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition "
      >
        Direct Messages
      </div>
      <ScrollArea className="px-2">
        {conversations.map((conversation) => {
          return <ConversationTab key={conversation.id} profileId={profile.id} conversation={conversation} />;
        })}
      </ScrollArea>
    </div>
  );
};
