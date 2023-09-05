"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";
import { ServerWithMembers } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const LeaveServer = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, onClose, type, isModalOpen, data } = useModalStore();
  const openModal = isModalOpen && type === "leaveServer";
  const router = useRouter();

  const { server } = data as { server: ServerWithMembers };
  console.log(server);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">Leave Server</DialogTitle>
          <DialogDescription className="text-sm text-center">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col space-y-4 pb-8 px-6">
          <div className="flex items-center justify-between w-full">
            <Button className="w-full" disabled={isLoading} onClick={onClose} variant={"default"}>
              Cancel
            </Button>
            <Button className="w-full" disabled={isLoading} onClick={onClick} variant={"test"}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServer;
