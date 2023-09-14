import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

type Props = {
  onChange: (emoji: string) => void;
};

const EmojiPicker = (props: Props) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent className="bg-transparent border-none shadow-none drop-shadow-none mb-16" side="right" sideOffset={40}>
        <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => props.onChange(emoji.native)} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
