import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";

type Props = {
  serverId: string;
};

const ServerSidebar = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: props.serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => {
    channel.type === ChannelType.TEXT;
  });

  const voiceChannels = server?.channels.filter((channel) => {
    channel.type === ChannelType.AUDIO;
  });

  const videoChannels = server?.channels.filter((channel) => {
    channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    member.profileId !== profile.id;
  });

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => (member.profileId = profile.id))?.role

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
