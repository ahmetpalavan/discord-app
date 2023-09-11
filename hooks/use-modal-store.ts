import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
}

type ModalState = {
  type: ModalType | null;
  data?: ModalData;
  isModalOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  data: {},
  isModalOpen: false,
  onOpen: (type, data = {}) => set({ type, data, isModalOpen: true }),
  onClose: () => set({ type: null, isModalOpen: false }),
}));
