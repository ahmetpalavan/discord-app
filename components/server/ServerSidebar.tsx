import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, Role } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerHeader from "./ServerHeader";
import { ServerSearch } from "./ServerSearch";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";

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

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const voiceChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => (member.profileId = profile.id))?.role;

  const iconMap = {
    [ChannelType.TEXT]: <Hash className="w-5 h-5 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="w-5 h-5 mr-2" />,
    [ChannelType.VIDEO]: <Video className="w-5 h-5 mr-2" />,
  };

  const roleIconMap = {
    [Role.GUEST]: <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />,
    [Role.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [Role.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
  };

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 gap-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: voiceChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
        <Separator className="mt-2 bg-zinc-200 rounded-md dark:bg-zinc-700 my-2" />
        {!!textChannels?.length && (
          <div className="mb-2 ">
            <ServerSection channelType={ChannelType.TEXT} label="Text Channels" role={role || Role.GUEST} sectionType="channels" />
          </div>
        )}
        {textChannels?.map((channel) => (
          <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
        ))}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
