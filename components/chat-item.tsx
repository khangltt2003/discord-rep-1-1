"use client";

import { MessageWithMemberProfile } from "@/type";
import { format } from "date-fns";
import { UserAvatar } from "./user-avatar";
import { FileText, PenSquare, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { Member, MemberRole, MessageType, Profile } from "@prisma/client";
import Image from "next/image";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

export const ChatItem = ({ currentMember, message }: { currentMember: Member; message: MessageWithMemberProfile }) => {
  const { content, member, type, fileUrl, isDeleted, createdAt, updatedAt } = message;
  const { name, imageUrl } = member.profile;
  const timestamp = format(new Date(createdAt), "hh:mm a");

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isMod = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDeleteMessage = !isDeleted && (isAdmin || isMod || isOwner);
  const canEditMessage = !isDeleted && isOwner && type == MessageType.TEXT;

  const isEdited = createdAt === updatedAt ? false : true;

  return (
    <div className="flex items-start space-x-3 py-2 hover:bg-[#58585f4d] rounded-xl group relative">
      {/* edit and delete */}
      <div className="hidden group-hover:flex  gap-1 absolute top-[-10px] right-5  text-lg z-30 ">
        {canEditMessage && <PenSquare className="text-neutral-400 hover:text-neutral-100 " />}
        {canDeleteMessage && <Trash2 className="text-rose-400 hover:text-rose-500 " />}
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
            {type === MessageType.IMAGE && fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Image src={fileUrl} alt={"file"} width={500} height={500} />
              </a>
            )}

            {type === MessageType.PDF && fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-16 w-16 text-neutral-300 hover:text-blue-300" />
                <span className="text-sm text-neutral-400 hover:text-blue-300 hover:underline">{content}</span>
              </a>
            )}
          </>
        ) : (
          <p className="text-neutral-500 italic">this message is deleted.</p>
        )}
      </div>
    </div>
  );
};
