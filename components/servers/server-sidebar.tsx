import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ServerChannelBar } from "./server-channel-bar";
import { ServerHeader } from "./server-header";

interface ServersidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServersidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <div className=" h-full flex flex-col ">
      <div className="h-12 w-full mb-3">
        <ServerHeader server={server} role={role} />
      </div>
      <ScrollArea>
        <ServerChannelBar
          label="text"
          server={server}
          channels={textChannels ? textChannels : []}
          role={role ? role : MemberRole.GUEST}
        />
        <Separator className="  bg-neutral-500 my-3" />

        <ServerChannelBar
          label="audio"
          server={server}
          channels={audioChannels ? audioChannels : []}
          role={role ? role : MemberRole.GUEST}
        />
        <Separator className=" bg-neutral-500 my-3" />

        <ServerChannelBar
          label="video"
          server={server}
          channels={videoChannels ? videoChannels : []}
          role={role ? role : MemberRole.GUEST}
        />
      </ScrollArea>
    </div>
  );
};
