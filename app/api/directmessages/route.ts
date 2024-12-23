import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 15;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return new NextResponse("no channel id", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        where: {
          conversationId: conversationId,
        },
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: {
          profile: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        where: {
          conversationId: conversationId,
        },
        take: MESSAGE_BATCH,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const nextCursor = messages.length === MESSAGE_BATCH ? messages[MESSAGE_BATCH - 1].id : null;

    return NextResponse.json({
      messages: messages,
      nextCursor: nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
