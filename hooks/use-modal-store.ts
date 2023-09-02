import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel";
interface ModalData {
  server?: Server;
  channelType?: ChannelType
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
