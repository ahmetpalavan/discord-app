import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembers = Server & {
  members: (Member & { profile: Profile })[];
};
