"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { ManageMemberModal } from "@/components/modals/manage-member-modal";
import { SettingServerModal } from "@/components/modals/setting-server-modal";
import { useEffect, useState } from "react";
import { CreateAudioChannelModal } from "../modals/create-channel-audio-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateTextChannelModal } from "../modals/create-channel-text-modal";
import { CreateVideoChannelModal } from "../modals/create-channel-video-modal";
import { CreateConversation } from "../modals/create-conversation-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { MessageFileModal } from "../modals/message-file";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <SettingServerModal />
      <ManageMemberModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <CreateChannelModal />
      <CreateAudioChannelModal />
      <CreateTextChannelModal />
      <CreateVideoChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <CreateConversation />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
