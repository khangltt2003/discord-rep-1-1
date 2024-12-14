import { ChannelType, Server } from "@prisma/client";
import { Hash, Video, Volume2Icon } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import ServerSearch from "../servers/server-search";
import { ServerWithChannelsWithMembersWithProfiles } from "@/type";
import { SocketIndicator } from "../socket-indicator";

const iconMap = {
  TEXT: <Hash className="5 w-5 mr-2" />,
  AUDIO: <Volume2Icon className="5 w-5 mr-2" />,
  VIDEO: <Video className="5 w-5 mr-2" />,
};

interface ChatHeaderProps {
  name: string;
  type: ChannelType;
  serverId: string;
  server: ServerWithChannelsWithMembersWithProfiles;
}

export const ChannelHeader = ({ server, name, type, serverId }: ChatHeaderProps) => {
  return (
    <div className="h-12 flex items-center border-b-2 border-neutral-600 px-4 text-neutral-300 font-semibold">
      <MobileToggle serverId={serverId} />
      {iconMap[type]} {name}
      <div className="ml-auto flex items-center">
        <SocketIndicator />
        <ServerSearch server={server} />
      </div>
    </div>
  );
};
