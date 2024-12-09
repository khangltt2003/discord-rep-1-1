"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { ChevronDown, ChevronRight, Hash, Plus, Video, Volume2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelBarProps {
  server: Server;
  label: string;
  channels: Channel[];
  role: MemberRole;
}

const iconMap = {
  TEXT: <Hash className="h-4 w-4 mr-2" />,
  AUDIO: <Volume2Icon className="h-4 w-4 mr-2" />,
  VIDEO: <Video className="h-4 w-4 mr-2" />,
};

export const ServerChannelBar = ({ server, label, channels, role }: ServerChannelBarProps) => {
  const { onOpen, onClose } = useModal();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const params = useParams();

  const handleOnClick = (channelId: string) => {
    router.push(`/servers/${params.serverId}/channels/${channelId}`);
  };

  const handleAddChannel = () => {
    if (label === "text") {
      onOpen("createTextChannel", { server: server });
    }
    //
    else if (label === "audio") {
      onOpen("createAudioChannel", { server: server });
    }
    //
    else if (label === "video") {
      onOpen("createVideoChannel", { server: server });
    }
  };

  return (
    <div className="mx-2 mb-6">
      <div className="flex items-center text-neutral-400 text-sm ">
        <div className=" flex items-center hover:text-neutral-300 uppercase cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          {label} channels
        </div>

        {role != MemberRole.GUEST && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-auto hover:text-neutral-300">
                <Plus className="h-4 w-4" onClick={handleAddChannel} />
              </TooltipTrigger>
              <TooltipContent side="right" align="center" className="bg-neutral-700">
                <p>add {label} channel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {isOpen && channels.length > 0 && (
        <div className="ml-4 ">
          {channels.map((channel) => {
            return (
              <div
                key={channel.id}
                className="flex items-center text-base px-2 py-1 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                onClick={() => handleOnClick(channel.id)}
              >
                {iconMap[channel.type]}
                {channel.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
