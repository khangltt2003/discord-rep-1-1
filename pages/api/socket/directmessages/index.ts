import { currentProfilePages } from "@/lib/current-profile-pages ";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl, type } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "no convesation id" });
    }

    if (!content) {
      return res.status(400).json({ error: "no channel id" });
    }

    const conversation = await db.conversation.findMany({
      where: {
        id: conversationId as string,
        OR: [{ memberOneId: profile.id }, { memberTwoId: profile.id }],
      },
    });

    if (!conversation) {
      return res.status(400).json({ error: "cannot find conversation" });
    }

    const message = await db.directMessage.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        type: type,
        profileId: profile.id,
        conversationId: conversationId as string,
      },

      include: {
        profile: true,
      },
    });

    const addKey = `conversation-${conversationId}-new-messages`;

    res?.socket?.server?.io?.emit(addKey, message);

    return res.status(200).json({ message: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}
