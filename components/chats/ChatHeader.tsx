import React from "react";
import { Hash, Menu } from "lucide-react";
import MobileToggle from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import { SocketIndicator } from "../SocketIndicator";

type Props = {
  serverId: string;
  type: "channel" | "conversation";
  name: string;
  imageUrl?: string;
};

const ChatHeader = (props: Props) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={props.serverId} />
      {props.type === "channel" && <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />}
      {props.type === "conversation" && <UserAvatar src={props.imageUrl} className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />}
      <div className="ml-2 font-semibold text-md text-black dark:text-white">{props.name}</div>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
