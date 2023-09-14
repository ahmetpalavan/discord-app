import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";

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

const ChatMessages = (props: Props) => {
  const queryKey = `chat:${props.chatId}:messages`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: [queryKey] as any,
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
  });
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={props.name} type={props.type} />
    </div>
  );
};

export default ChatMessages;
