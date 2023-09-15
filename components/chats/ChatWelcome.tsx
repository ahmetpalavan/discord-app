import { Hash } from "lucide-react";
import React from "react";

type Props = {
  name: string;
  type: "channel" | "conversation";
};

const ChatWelcome = (props: Props) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {props.type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {props.type === "channel" ? `Welcome to #${props.name}` : `Welcome to your DM with ${props.name}`}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {props.type === "channel"
          ? `This is the beginning of the ${props.name} channel.`
          : `This is the beginning of your conversation with ${props.name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;
