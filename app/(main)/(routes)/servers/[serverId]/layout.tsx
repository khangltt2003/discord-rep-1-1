import { ServerMemberSidebar } from "@/components/servers/server-member-sidebar";
import { ServerSidebar } from "@/components/servers/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIdlayout = async (
  props: { children: React.ReactNode; params: Promise<{ serverId: string }> }
) => {
  const params = await props.params;

  const {
    children
  } = props;

  const profile = await currentProfile();

  const { serverId } = params;

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
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex flex-col w-72 z-20 inset-y-0 bg-[#00000045]">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full w-full">{children}</main>
    </div>
  );
};

export default ServerIdlayout;
