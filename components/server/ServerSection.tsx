"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, Role } from "@prisma/client";
import { Plus, Settings } from "lucide-react";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { useModalStore } from "@/hooks/use-modal-store";

type Props = {
  label: string;
  role: Role;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
};

const ServerSection = (props: Props) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{props.label}</p>
      {props.role !== Role.GUEST && props.sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { server: props.server, channelType: props.channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {props.role !== Role.GUEST && props.sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server: props.server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
