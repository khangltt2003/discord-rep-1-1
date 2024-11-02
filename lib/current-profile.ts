import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const currentProfile = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userID: userId,
    },
  });
  return profile;
};
