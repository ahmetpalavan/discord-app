import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembers = Server & {
  members: (Member & { profile: Profile })[];
};
