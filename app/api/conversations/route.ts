import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("unthorized", { status: 401 });
    }

    const { memberTwoId } = await req.json();

    if (!memberTwoId) {
      return new NextResponse("no memeber two id", { status: 400 });
    }

    if (profile.id === memberTwoId) {
      return new NextResponse("cannot create conversation with yourself", { status: 400 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        OR: [
          { memberOneId: profile.id, memberTwoId: memberTwoId },
          { memberOneId: memberTwoId, memberTwoId: profile.id },
        ],
      },
    });

    if (conversation) {
      return NextResponse.json(conversation);
    }

    const newConversation = await db.conversation.create({
      data: {
        memberOneId: profile.id,
        memberTwoId: memberTwoId,
      },
    });
    return NextResponse.json(newConversation);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
