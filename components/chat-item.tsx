"use client";

import { MessageWithMemberProfile } from "@/type";
import { format } from "date-fns";
import { UserAvatar } from "./user-avatar";
import { PenSquare, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { MessageType } from "@prisma/client";
import Image from "next/image";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

export const ChatItem = ({ message }: { message: MessageWithMemberProfile }) => {
  const { content, member, type, fileUrl, isDeleted, createdAt, updatedAt } = message;
  const { name, imageUrl } = member.profile;
  const timestamp = format(new Date(createdAt), "hh:mm a");

  const isEdited = createdAt === updatedAt ? false : true;

  return (
    <div className="flex items-start space-x-3 py-2 hover:bg-zinc-700 rounded-xl group relative">
      <div className="hidden group-hover:flex  gap-1 absolute top-[-10px] right-5  text-lg z-30 ">
        <PenSquare className="text-neutral-400 hover:text-neutral-100 " />
        <Trash2 className="text-rose-400 hover:text-rose-500 " />
      </div>

      <UserAvatar src={imageUrl} className="md:h-10 md:w-10" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-semibold group text-neutral-300 group-hover:text-neutral-200">{name}</span>
          {roleIconMap[member.role]}
          <span className="text-xs text-gray-400 ">{timestamp}</span>
        </div>

        {!isDeleted ? (
          <>
            {type === MessageType.TEXT && (
              <p className="text-base text-gray-300 group  group-hover:text-gray-200">
                {content}
                {isEdited && <span className="text-sm text-gray-400 hover:text-gray-300"> (edited)</span>}
              </p>
            )}
            {type === MessageType.IMAGE && fileUrl && <Image src={fileUrl} alt={"file"} width={500} height={500} />}
          </>
        ) : (
          <p>this message is deleted.</p>
        )}
      </div>
    </div>
  );
};
