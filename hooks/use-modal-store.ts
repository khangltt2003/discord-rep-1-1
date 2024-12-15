import { Channel, Profile, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "serverSetting"
  | "manageMember"
  | "deleteServer"
  | "leaveServer"
  | "createChannel"
  | "createTextChannel"
  | "createAudioChannel"
  | "createVideoChannel"
  | "editChannel"
  | "deleteChannel"
  | "createConversation"
  | "messageFile";

interface ModalData {
  server?: Server;
  channel?: Channel;
  profile?: Profile;
  apiUrl? : string
  query?: Record<string,any>
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
