import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

//create server
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: "general", profileId: profile.id },
            {
              name: "first voice chat",
              profileId: profile.id,
              type: ChannelType.AUDIO,
            },
          ],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
