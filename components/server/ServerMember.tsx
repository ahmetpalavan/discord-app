"use client";

import { cn } from "@/lib/utils";
import { Member, Profile, Role, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";

type Props = {
  server: Server;
  member: Member & {
    profile: Profile;
  };
};

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const ServerMember = (props: Props) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[props.member.role];

  const onClick = () => {
    router.push(`/server/${params.serverId}/conversations/${props.member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === props.member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={props.member.profile.imageUrl || undefined} className="h-8 w-8 md:w-8 md:h-8" />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === props.member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {props.member.profile.name}
      </p>
    </button>
  );
};

export default ServerMember;
