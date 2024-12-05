import { ServerSidebar } from "@/components/servers/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIdlayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
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
  });

  console.log(server);

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex flex-col w-60 z-20 inset-y-0 bg-[#0000002c]">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full w-full">{children}</main>
    </div>
  );
};

export default ServerIdlayout;
