import { useOrigin } from "@/hooks/use-origin";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { create } from "domain";
import { ParkingMeter } from "lucide-react";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async (props: InviteCodePageProps) => {
  const params = await props.params;
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  if (!params.inviteCode) {
    return redirect("/");
  }

  //check if user already in the server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) return redirect(`/servers/${server?.id}`);
  return null;
};

export default InviteCodePage;
