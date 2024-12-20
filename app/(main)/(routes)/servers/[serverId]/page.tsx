import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const serverpage = async (props: { params: Promise<{ serverId: string }> }) => {
  const params = await props.params;
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const genneralChannel = server?.channels[0];

  if (genneralChannel?.name === "general") {
    return redirect(`/servers/${params.serverId}/channels/${genneralChannel.id}`);
  }

  return null;
};

export default serverpage;
