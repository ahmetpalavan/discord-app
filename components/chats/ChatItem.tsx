import { cn } from "@/lib/utils";
import { Member, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ActionTooltip from "../ActionTooltip";
import UserAvatar from "../UserAvatar";
import * as z from "zod";
import { FormControl, Form, FormField, FormItem } from "../ui/form";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModalStore } from "@/hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";

type Props = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
};

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModalStore();
  const fileType = props.fileUrl?.split(".").pop();
  const router = useRouter();
  const params = useParams();

  const isAdmin = props.currentMember.role === "ADMIN";
  const isModerator = props.currentMember.role === "MODERATOR";
  const isOwner = props.currentMember.id === props.member.id;
  const canDeleteMessage = !props.deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !props.deleted && isAdmin && !props.fileUrl;
  const isPDF = fileType === "pdf" && props.fileUrl;
  const isImage = !isPDF && props.fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: props.content,
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        setIsEditing(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: `${props.socketUrl}/${props.id}`,
      query: props.socketQuery,
    });
    await axios.patch(url, data);
    form.reset();
    setIsEditing(false);
  };

  useEffect(() => {
    form.reset({
      content: props.content,
    });
  }, [props.content, form]);

  const isLoading = form.formState.isSubmitting;

  const onMemberClick = () => {
    if (props.member.id === props.currentMember.id) {
      return;
    }
    router.push(`/server/${params?.serverId}/conversations/${props.member.id}`);
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={props.member.profile.imageUrl!} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">{props.member.profile.name}</p>
              <ActionTooltip label={props.member.role}>{roleIconMap[props.member.role]}</ActionTooltip>
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">{props.timestamp}</span>
          </div>
          {isImage && (
            <a
              href={props.fileUrl!}
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
              target="_blank"
              rel="noreferrer"
            >
              <Image src={props.fileUrl!} layout="fill" objectFit="cover" alt="Uploaded image" />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={props.fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!props.fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                props.deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {props.content}
              {props.isUpdated && !props.deleted && <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>}
            </p>
          )}
          {!props.fileUrl && isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-2" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Press escape to cancel, enter to save</span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit message">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete message">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${props.socketUrl}/${props.id}`,
                  query: props.socketQuery,
                })
              }
              className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
