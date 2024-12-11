import { Channel, Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & { members: (Member & { profile: Profile })[] };
export type ServerWithChannelsWithMembersWithProfiles = Server & { channels: Channel[] } & { members: (Member & { profile: Profile })[] };
