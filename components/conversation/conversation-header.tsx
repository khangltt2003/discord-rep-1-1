"use client";

import { Profile } from "@prisma/client";
import { LucideMessageSquareText, Phone, Video } from "lucide-react";
import { SocketIndicator } from "../socket-indicator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActionToolTip } from "../action-tooltip";

export const ConversationHeader = ({ memberTwo }: { memberTwo: Profile }) => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAudioCall = () => {
    if (path && searchParams?.get("audio")) {
      router.push(path);
    } else {
      router.push(`${path}?audio=true`);
    }
  };

  const handleVideoCall = () => {
    if (path && searchParams?.get("video")) {
      router.push(path);
    } else {
      router.push(`${path}?video=true`);
    }
  };

  return (
    <div className="h-12 flex items-center border-b-2 border-neutral-600 px-4 text-neutral-300 font-semibold">
      <LucideMessageSquareText className="5 w-5 mr-2" /> {memberTwo.name}
      <div className="ml-auto flex justify-center items-center gap-3">
        <ActionToolTip label="audio call" side="bottom" align="center">
          <Phone onClick={handleAudioCall} />
        </ActionToolTip>
        <ActionToolTip label="video call" side="bottom" align="center">
          <Video onClick={handleVideoCall} />
        </ActionToolTip>
        <SocketIndicator />
      </div>
    </div>
  );
};
