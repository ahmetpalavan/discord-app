"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, Role, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

type Props = {
  channel: Channel;
  server: Server;
  role?: Role;
};

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = (props: Props) => {
  const { onOpen } = useModalStore();
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[props.channel.type];

  const onClick = () => {
    router.push(`/server/${params?.serverId}/channels/${props.channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server: props.server, channel: props.channel });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === props.channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === props.channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {props.channel.name}
      </p>
      {props.channel.name !== "general" && props.role !== Role.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {props.channel.name === "general" && <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
    </button>
  );
};

export default ServerChannel;
