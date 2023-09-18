import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  }
};

const MemberIdPage = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: props.params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(props.params.memberId, currentMember.id);

  if (!conversation) {
    return redirect(`/server/${props.params.serverId}/conversations`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={props.params.serverId}
        imageUrl={otherMember.profile.imageUrl!}
        type="conversation"
      />
      {props.searchParams.video && <MediaRoom audio={true} video={true} chatId={conversation.id} />}
      {!props.searchParams.video && (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketQuery={{ conversationId: conversation.id }}
            socketUrl="/api/socket/direct-messages"
          />
          <ChatInput
            name={otherMember.profile.name}
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
            type="conversation"
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
