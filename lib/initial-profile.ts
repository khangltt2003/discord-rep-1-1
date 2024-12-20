import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  //find the user in clerk database
  const user = await currentUser();
  // console.log(user);
  if (!user) {
    return redirect("/sign-in");
  }

  //find profile that matches with user.id
  const profile = await db.profile.findUnique({
    where: {
      userID: user.id,
    },
  });

  if (profile) return profile;

  //create profile if user dont have profile
  const newProfile = await db.profile.create({
    data: {
      userID: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
