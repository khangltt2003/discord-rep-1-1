"use client";
import { MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "./user-avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
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
      className={cn("flex items-center gap-x-3 mb-2 p-1  rounded-lg hover:text-neutral-300 hover:bg-neutral-700")}
      onClick={() => onOpen("createConversation", { profile })}
    >
      <UserAvatar src={profile.imageUrl} className={"h-1 w-1"} />
      {profile.name}
      {roleIconMap[role]}
    </div>
  );
};
