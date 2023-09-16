"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, Fragment, useRef } from "react";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";

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
  const addKey = `chat:${props.chatId}:add-message`;
  const updateKey = `chat:${props.chatId}:update-message`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: [queryKey] as any,
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
  });

  useChatSocket({ addKey, queryKey, updateKey });

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

  console.log(hasNextPage, isFetchingNextPage, "hasNextPage");

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={props.name} type={props.type} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
