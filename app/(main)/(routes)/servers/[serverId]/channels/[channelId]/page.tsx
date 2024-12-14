import { ChannelHeader } from "@/components/channel/channel-header";
import { ChannelInput } from "@/components/channel/channel-input";
import { ServerMemberSidebar } from "@/components/servers/server-member-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ChannelPage = async (props: { params: Promise<{ serverId: string; channelId: string }> }) => {
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
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params.serverId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!server || !channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#00000014] h-full flex flex-col ">
      <div>
        <ChannelHeader server={server} serverId={params.serverId} type={channel.type} name={channel.name} />
      </div>
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full p-4 ">
          <ScrollArea className="flex-1">future message</ScrollArea>
          <ChannelInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{ channelId: channel.id, serverId: server.id }} />
        </div>

        <div className="hidden md:flex flex-col w-64 z-20 bg-[#00000045]  ">
          <ServerMemberSidebar server={server} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
