"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal-store";
import { Channel } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { Button } from "../ui/button";
import { ServerWithMembersWithProfiles } from "@/types";

type Props = {};

const DeleteMessage = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, onClose, type, isModalOpen, data } = useModalStore();
  const openModal = isModalOpen && type === "deleteMessage";
  const router = useRouter();

  const { apiUrl, query } = data as any;

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.delete(url);
      onClose();
      router.refresh();
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
          <DialogTitle className="text-2xl font-bold text-center">Delete Message</DialogTitle>
          <DialogDescription className="text-sm text-center">
            Are you sure you want to do this? <br />
            The message will be permanently deleted.
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

export default DeleteMessage;
