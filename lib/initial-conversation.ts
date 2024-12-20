import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "./current-profile";

export const initialConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const conversation = await db.conversation.findFirst({
    where: {
      memberOneId: memberOneId,
      memberTwoId: memberTwoId,
    },
  });

  if (conversation) {
    return conversation;
  }

  const newConversation = await db.conversation.create({
    data: {
      memberOneId: memberOneId,
      memberTwoId: memberTwoId,
    },
  });
  return newConversation;
};
