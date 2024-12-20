import { currentProfilePages } from "@/lib/current-profile-pages ";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl, type } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "no server id" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "no channel id" });
    }

    if (!content) {
      return res.status(400).json({ error: "no channel id" });
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
      return res.status(400).json({ error: "cannot find serer" });
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

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(400).json({ error: "cannot find member" });
    }

    const message = await db.message.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        type: type,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `channel-${channelId}-new-messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
}
