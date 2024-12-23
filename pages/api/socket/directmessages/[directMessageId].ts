import { currentProfilePages } from "@/lib/current-profile-pages ";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  console.log(1);
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const { content } = req.body;
    const { conversationId, directMessageId } = req.query;

    if (!directMessageId) {
      return res.status(400).json({ error: "missing message id" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
      },
    });

    if (!conversation) {
      return res.status(400).json({ error: "cannot find conversation" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
    });

    if (!message || message.isDeleted) {
      return res.status(400).json({ error: "cannot find message" });
    }

    const isOwner = message.profileId === profile.id;

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(400).json({ error: "cannot edit this message" });
      }
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content: content,
        },
        include: {
          profile: true,
        },
      });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content: "this message is deleted.",
          fileUrl: null,
          isDeleted: true,
        },
        include: {
          profile: true,
        },
      });
    }

    const updateKey = `conversation-${conversationId}-update-messages`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json({ message: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}
