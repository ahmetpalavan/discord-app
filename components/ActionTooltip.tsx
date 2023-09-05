"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

type Props = {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
};

const ActionTooltip = (props: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent sideOffset={5} alignOffset={5} side={props.side} align={props.align}>
          <p className="font-semibold text-sm capitalize">{props.label.toLowerCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
