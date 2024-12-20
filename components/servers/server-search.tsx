"use client";
import { cn } from "@/lib/utils";
import { ServerWithChannelsWithMembersWithProfiles } from "@/type";
import { ChannelType } from "@prisma/client";
import {
  Hash,
  ShieldAlert,
  ShieldCheck,
  Video,
  Volume2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

const iconMap = {
  TEXT: <Hash className="h-5 w-5 mr-2" />,
  AUDIO: <Volume2Icon className="h-5 w-5 mr-2" />,
  VIDEO: <Video className="h-5 w-5 mr-2" />,
};

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

export function ServerSearch({
  server,
}: {
  server: ServerWithChannelsWithMembersWithProfiles;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();

  const filteredTextChannel = server.channels.filter(
    (channel) =>
      channel.name.includes(input.toLowerCase()) &&
      channel.type === ChannelType.TEXT,
  );
  const filteredAudioChannel = server.channels.filter(
    (channel) =>
      channel.name.includes(input.toLowerCase()) &&
      channel.type === ChannelType.AUDIO,
  );
  const filteredVideoChannel = server.channels.filter(
    (channel) =>
      channel.name.includes(input.toLowerCase()) &&
      channel.type === ChannelType.VIDEO,
  );
  const filteredMember = server.members.filter((member) =>
    member.profile.name.toLowerCase().includes(input.toLowerCase()),
  );
  const handleOnClick = (channelId: string) => {
    router.push(`/servers/${server.id}/channels/${channelId}`);
  };

  return (
    <div
      className={cn(
        "mt-1 transition-all duration-300 relative",
        isOpen ? "w-80" : "w-52",
      )}
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="mx-3 h-7 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search"
      />
      {isOpen && (
        <div className="absolute top-10 left-3 bg-[#161616] w-80 h-96  rounded-xl p-3 font-normal z-50">
          <ScrollArea className="h-full">
            {filteredTextChannel.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold">Text Channels:</p>
                {filteredTextChannel.map((channel) => {
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center hover:bg-neutral-600 rounded-md p-1 cursor-pointer"
                      onMouseDown={() => handleOnClick(channel.id)}
                    >
                      {iconMap[channel.type]}
                      {channel.name}
                    </div>
                  );
                })}
              </div>
            )}
            {filteredAudioChannel.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold">Audio Channels:</p>
                {filteredAudioChannel.map((channel) => {
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center hover:bg-neutral-600 rounded-md p-1 cursor-pointer"
                      onMouseDown={() => handleOnClick(channel.id)}
                    >
                      {iconMap[channel.type]}
                      {channel.name}
                    </div>
                  );
                })}
              </div>
            )}
            {filteredVideoChannel.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold">Video Channels:</p>
                {filteredVideoChannel.map((channel) => {
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center hover:bg-neutral-600 rounded-md p-1 cursor-pointer"
                      onMouseDown={() => handleOnClick(channel.id)}
                    >
                      {iconMap[channel.type]}
                      {channel.name}
                    </div>
                  );
                })}
              </div>
            )}
            {filteredMember.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold">Members:</p>
                {filteredMember.map((member) => {
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 hover:bg-neutral-600 rounded-md p-1 cursor-pointer"
                      onMouseDown={() => handleOnClick(member.profile.id)}
                    >
                      {member.profile.name}
                      {roleIconMap[member.role]}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export default ServerSearch;
