import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ channelId: string }> },
) {
  const params = await props.params;
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.channelId) {
      return new NextResponse("no channel id", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("no server id", { status: 400 });
    }

    const { name, type } = await req.json();

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name: name,
              type: type,
            },
          },
        },
      },
    });
    return new NextResponse("channel edited", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ channelId: string }> },
) {
  try {
    const params = await props.params;

    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("unthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("no server id", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("no channel id", { status: 400 });
    }

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
          },
        },
      },
    });
    return new NextResponse("channel deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
