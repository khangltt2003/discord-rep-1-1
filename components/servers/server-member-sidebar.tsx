import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { MemberRole } from "@prisma/client";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

export const ServerMemberSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile?.id,
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
    },
  });

  if (!server) {
    return redirect("/");
  }

  const admins = server.members.filter((member) => member.role === MemberRole.ADMIN);
  const mods = server.members.filter((member) => member.role === MemberRole.MODERATOR);
  const guests = server.members.filter((member) => member.role === MemberRole.GUEST);

  return (
    <div className="mt-3 mx-3 text-neutral-400 font-semibold">
      {admins.length > 0 && (
        <div className="mb-6">
          <p className="mb-2">Admin</p>
          {admins.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-3 mb-2 p-1  rounded-lg hover:text-neutral-300 hover:bg-neutral-700">
                <UserAvatar src={member.profile.imageUrl} className={"h-1 w-1"} />
                {member.profile.name}
                {roleIconMap[member.role]}
              </div>
            );
          })}
        </div>
      )}
      {mods.length > 0 && (
        <div className="mb-6 ">
          <p className="mb-2">Moderator</p>
          {mods.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-3 p-1  rounded-lg hover:text-neutral-300 hover:bg-neutral-700">
                <UserAvatar src={member.profile.imageUrl} />
                {member.profile.name}
                {roleIconMap[member.role]}
              </div>
            );
          })}
        </div>
      )}
      {guests.length > 0 && (
        <div>
          <p className="mb-2">Guest</p>
          {guests.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-3 mb-2 p-1 rounded-lg hover:text-neutral-300 hover:bg-neutral-700">
                <UserAvatar src={member.profile.imageUrl} />
                {member.profile.name}
                {roleIconMap[member.role]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
