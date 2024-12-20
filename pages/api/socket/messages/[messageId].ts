import { currentProfilePages } from "@/lib/current-profile-pages ";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const { content } = req.body;
    const { channelId, serverId, messageId } = req.query;

    if (!channelId) {
      return res.status(400).json({ error: "missing channel id" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "missing message id" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "missing server id" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(400).json({ error: "cannot find channel" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(400).json({ error: "cannot find server" });
    }

    const member = server?.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(400).json({ error: "cannot find member" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
    });

    if (!message || message.isDeleted) {
      return res.status(400).json({ error: "cannot find message" });
    }

    const isAdmin = member.role === MemberRole.ADMIN;
    const isMod = member.role === MemberRole.MODERATOR;
    const isOwner = member.id === message.memberId;

    const canEdit = isAdmin || isMod || isOwner;
    if (!canEdit) {
      return res.status(400).json({ error: "cannot modify this message" });
    }

    if (req.method === "PATCH") {
      if (!isOwner) {
        return res.status(400).json({ error: "cannot edit this message" });
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          content: "this message is deleted.",
          fileUrl: null,
          isDeleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `channel-${channelId}-update-messages`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}
