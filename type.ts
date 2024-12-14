import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

import { Channel, Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    profile: Profile;
  })[];
};
export type ServerWithChannelsWithMembersWithProfiles = Server & {
  channels: Channel[];
} & {
  members: (Member & {
    profile: Profile;
  })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
