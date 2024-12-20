import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

import {
  Channel,
  Conversation,
  Member,
  Message,
  Profile,
  Server,
} from "@prisma/client";

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

export type MessageWithMemberProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export type ConversationWithMemberProfile = Conversation & {
  memberOne: Profile;
} & {
  memberTwo: Profile;
};

export type MemberWithProfile = Member & { profile: Profile };
