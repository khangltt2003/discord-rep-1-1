import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: { params: Promise<{ serverId: string }> }) {
  const params = await props.params;
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("missing server id", { status: 400 });
    }

    await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return new NextResponse("member left", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("server internal error", { status: 500 });
  }
}
