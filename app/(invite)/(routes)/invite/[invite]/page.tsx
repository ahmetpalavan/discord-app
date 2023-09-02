import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  params: {
    invite: string;
  };
};

const Invite = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.invite) {
    return redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: params.invite,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  const updatedServer = await db.server.update({
    where: {
      inviteCode: params.invite,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (updatedServer) {
    return redirect(`/server/${updatedServer.id}`);
  }

  return null;
};

export default Invite;
