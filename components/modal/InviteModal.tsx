"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import { ServerWithMembersWithProfiles } from "@/types";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";

type Props = {};

const InviteModal = (props: Props) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, onClose, type, isModalOpen, data } = useModalStore();
  const openModal = isModalOpen && type === "invite";

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const origin = useOrigin();

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server.id}/invite`);
      onOpen("invite", { server: response.data });

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
    } finally {
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400">Invite Link</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              disabled={isLoading}
              className="w-full bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 overflow-x-auto"
              value={inviteUrl}
              readOnly
            />
            <Button
              disabled={isLoading}
              onClick={handleCopy}
              className="text-xs font-semibold px-3 py-1 rounded-md bg-zinc-300/50 hover:bg-zinc-300/30 active:bg-zinc-300/20 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-zinc-300/50"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={onNew} disabled={isLoading} variant="link" size="sm" className="mt-4 text-xs text-zinc-500">
            Generate a new link
            <RefreshCcw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
