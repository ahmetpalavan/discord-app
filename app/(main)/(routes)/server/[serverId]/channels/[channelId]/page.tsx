import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: props.params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: props.params.serverId,
    },
  });

  if (!member || !channel) {
    redirect(`/server/${props.params.serverId}`);
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full justify-between">
      <ChatHeader serverId={props.params.serverId} type="channel" name={channel.name} />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            apiUrl="/api/messages"
            chatId={channel.id}
            member={member}
            name={channel.name}
            paramKey="channelId"
            paramValue={channel.id}
            socketQuery={{
              serverId: props.params.serverId,
              channelId: props.params.channelId,
            }}
            type="channel"
            socketUrl="/api/socket/messages"
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            name={channel.name}
            type="channel"
            query={{
              serverId: props.params.serverId,
              channelId: channel.id,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && <MediaRoom chatId={channel.id} video={false} audio={true} />}
      {channel.type === ChannelType.VIDEO && <MediaRoom chatId={channel.id} video={true} audio={true} />}
    </div>
  );
};

export default ChannelIdPage;
