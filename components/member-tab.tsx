"use client";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { MemberRole, Profile } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { UserAvatar } from "./user-avatar";

const roleIconMap = {
  ADMIN: <ShieldAlert className="ml-auto h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="ml-auto h-5 w-5 text-blue-400" />,
  GUEST: null,
};

interface ServerMemberTabProps {
  currentProfile: Profile;
  profile: Profile;
  role: MemberRole;
}

export const ServerMemberTab = ({ role, profile }: ServerMemberTabProps) => {
  const { onOpen } = useModal();

  return (
    <div
      className={cn("flex items-center gap-x-3 mb-2 p-1  rounded-lg hover:text-neutral-300 hover:bg-neutral-700 cursor-pointer")}
      onClick={() => onOpen("createConversation", { profile })}
    >
      <UserAvatar src={profile.imageUrl} className={"h-1 w-1"} />
      {profile.name}
      {roleIconMap[role]}
    </div>
  );
};
