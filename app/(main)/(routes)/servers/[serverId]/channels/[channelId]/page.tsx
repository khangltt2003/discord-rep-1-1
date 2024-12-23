import { ChannelHeader } from "@/components/channel/channel-header";
import { ChannelInput } from "@/components/chat/chat-input";
import { ChannelMessages } from "@/components/channel/channel-messages";
import { ServerMemberSidebar } from "@/components/servers/server-member-sidebar";
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

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!server || !channel || !currentMember) {
    return redirect("/");
  }

  return (
    <div className="h-full  bg-white dark:bg-[#00000014] flex flex-col ">
      <div className="h-12">
        <ChannelHeader server={server} serverId={params.serverId} type={channel.type} name={channel.name} />
      </div>

      <div className=" w-full h-full flex-1 flex border overflow-y-auto">
        <div className=" h-full w-full flex flex-col ">
          <ChannelMessages
            currentMember={currentMember}
            name={channel.name}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: server.id }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />
          <div className="px-4 py-3">
            <ChannelInput
              name={channel.name}
              type="channel"
              socketUrl="/api/socket/messages"
              socketQuery={{ channelId: channel.id, serverId: server.id }}
            />
          </div>
        </div>

        <div className=" hidden md:flex flex-col w-64 z-20 bg-[#00000045]  ">
          <ServerMemberSidebar server={server} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
