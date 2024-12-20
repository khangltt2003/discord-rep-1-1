"use client";

import { Channel, MemberRole, Server } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Hash,
  Plus,
  Trash2,
  Video,
  Volume2Icon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { ActionToolTip } from "../action-tooltip";

interface ServerChannelBarProps {
  server: Server;
  label: string;
  channels: Channel[];
  role: MemberRole;
}

const iconMap = {
  TEXT: <Hash className="h-5 w-5 mr-2" />,
  AUDIO: <Volume2Icon className="h-5 w-5 mr-2" />,
  VIDEO: <Video className="h-5 w-5 mr-2" />,
};

export const ServerChannelBar = ({
  server,
  label,
  channels,
  role,
}: ServerChannelBarProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const params = useParams();

  const handleOnClick = (channelId: string) => {
    if (!params.channelId || params.channelId !== channelId) {
      router.push(`/servers/${params.serverId}/channels/${channelId}`);
    }
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

  const handleEditAndDeleteChannel = (
    e: React.MouseEvent,
    action: ModalType,
    channel: Channel,
  ) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <div className="mx-3 mb-6">
      <div className="flex items-center text-neutral-400 text-sm ">
        <div
          className=" flex items-center font-semibold hover:text-neutral-300 uppercase cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          {label} channels
        </div>

        {role !== MemberRole.GUEST && (
          <div className="ml-auto">
            <ActionToolTip
              label={`add ${label} channel`}
              side="right"
              align="center"
            >
              <Plus className="h-4 w-4" onClick={handleAddChannel} />
            </ActionToolTip>
          </div>
        )}
      </div>

      {isOpen && channels.length > 0 && (
        <div className="ml-4 ">
          {channels.map((channel) => {
            return (
              <div
                key={channel.id}
                className={cn(
                  "group flex items-center text-base mb-1 px-2 py-1 rounded-md text-neutral-400  hover:text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                  params.channelId === channel.id &&
                    "bg-neutral-700 text-neutral-300",
                )}
                onClick={() => handleOnClick(channel.id)}
              >
                <div className="flex items-center">
                  {iconMap[channel.type]}
                  {channel.name}
                </div>

                {role !== MemberRole.GUEST && (
                  <div className="group hidden group-hover:flex  font-normal items-center gap-1 ml-auto">
                    <ActionToolTip
                      label="edit channel"
                      side="top"
                      align="center"
                    >
                      <Edit
                        className="h-4 w-4 hover:text-neutral-100"
                        onClick={(e) =>
                          handleEditAndDeleteChannel(e, "editChannel", channel)
                        }
                      />
                    </ActionToolTip>

                    <ActionToolTip
                      label="delete channel"
                      side="top"
                      align="center"
                    >
                      <Trash2
                        className="h-4 w-4 hover:text-neutral-100"
                        onClick={(e) =>
                          handleEditAndDeleteChannel(
                            e,
                            "deleteChannel",
                            channel,
                          )
                        }
                      />
                    </ActionToolTip>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
