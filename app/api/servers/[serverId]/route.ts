import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { STATUS_CODES } from "http";
import { NextResponse } from "next/server";

//update server image and name
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  const { name, imageUrl } = await req.json();

  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, //make sure only admin can edit server
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//delete server
export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("no server id", { status: 400 });
    }

    await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return new NextResponse("server deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
