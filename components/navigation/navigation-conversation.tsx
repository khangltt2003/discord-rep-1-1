"use client";

import Image from "next/image";
import { ActionToolTip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationConversation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isConversationsRoute = pathname?.includes("/conversations");

  const onClick = () => {
    router.push(`/conversations`);
  };

  return (
    <ActionToolTip label={"conversation"} side="right" align="center">
      <button className="group relative flex items-center" onClick={onClick}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            !isConversationsRoute && "group-hover:h-[20px]",
            isConversationsRoute ? "h-[40px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex items-center justify-center mx-3 h-[48px] w-[48px]  rounded-[24px] bg-neutral-700 hover:bg-indigo-500 group-hover:rounded-[16px] transition-all overflow-hidden",
            isConversationsRoute && "bg-indigo-500 text-primary rounded-[16px]"
          )}
        >
          <MessageSquare className="z-50" />
        </div>
      </button>
    </ActionToolTip>
  );
};

export default NavigationConversation;
