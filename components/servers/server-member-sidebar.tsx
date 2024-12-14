import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { MemberRole } from "@prisma/client";
import { ScrollArea } from "../ui/scroll-area";
import { ServerWithChannelsWithMembersWithProfiles } from "@/type";
import { ServerMemberTab } from "../member-tab";

export const ServerMemberSidebar = async ({ server }: { server: ServerWithChannelsWithMembersWithProfiles }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  if (!server) {
    return redirect("/");
  }

  const admins = server.members.filter((member) => member.role === MemberRole.ADMIN);
  const mods = server.members.filter((member) => member.role === MemberRole.MODERATOR);
  const guests = server.members.filter((member) => member.role === MemberRole.GUEST);

  return (
    <ScrollArea className="mt-3 mx-3 text-neutral-400 font-semibold">
      {admins.length > 0 && (
        <div className="mb-6">
          <p className="mb-2">Admin</p>
          {admins.map((member) => {
            return <ServerMemberTab currentProfile={profile} key={member.id} role={member.role} profile={member.profile} />;
          })}
        </div>
      )}
      {mods.length > 0 && (
        <div className="mb-6 ">
          <p className="mb-2">Moderator</p>
          {mods.map((member) => {
            return <ServerMemberTab currentProfile={profile} key={member.id} role={member.role} profile={member.profile} />;
          })}
        </div>
      )}
      {guests.length > 0 && (
        <div>
          <p className="mb-2">Guest</p>
          {guests.map((member) => {
            return <ServerMemberTab currentProfile={profile} key={member.id} role={member.role} profile={member.profile} />;
          })}
        </div>
      )}
    </ScrollArea>
  );
};
