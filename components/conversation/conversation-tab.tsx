"use client";
import { cn } from "@/lib/utils";
import { ConversationWithMemberProfile } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ConversationTabProps {
  profileId: string;
  conversation: ConversationWithMemberProfile;
}

export const ConversationTab = ({
  profileId,
  conversation,
}: ConversationTabProps) => {
  const params = useParams();

  const conversationId = params?.conversationId;

  const router = useRouter();

  const handleOnClick = () => {
    router.push(`/conversations/${conversation.id}`);
  };

  const memberTwo =
    conversation.memberOneId === profileId
      ? conversation.memberTwo
      : conversation.memberOne;

  return (
    <div
      className={cn(
        "flex items-center gap-x-3 mb-2 p-1  rounded-lg  text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700 font-semibold",
        conversationId === conversation.id &&
          " bg-neutral-700 text-neutral-300",
      )}
      onClick={handleOnClick}
    >
      <UserAvatar src={memberTwo.imageUrl} className={"h-1 w-1"} />
      {memberTwo.name}
    </div>
  );
};
