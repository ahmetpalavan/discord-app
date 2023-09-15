"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment } from "react";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = (props: Props) => {
  const queryKey = `chat:${props.chatId}:messages`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: [queryKey] as any,
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
  });

  const dateFormat = "d MMM yyyy, HH:mm";

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-12 w-12 text-zinc-500 dark:text-zinc-400 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-12 w-12 text-zinc-500 dark:text-zinc-400 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Failed to load messages.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={props.name} type={props.type} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                content={message.content}
                currentMember={props.member}
                deleted={message.deleted}
                id={message.id}
                isUpdated={message.updatedAt !== message.createdAt}
                member={message.member}
                socketQuery={props.socketQuery}
                socketUrl={props.socketUrl}
                timestamp={format(new Date(message.createdAt), dateFormat)}
                fileUrl={message.fileUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
