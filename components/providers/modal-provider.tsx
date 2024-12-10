"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { SettingServerModal } from "@/components/modals/setting-server-modal";
import { ManageMemberModal } from "@/components/modals/manage-member-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateAudioChannelModal } from "../modals/create-channel-audio-modal";
import { CreateTextChannelModal } from "../modals/create-channel-text-modal";
import { CreateVideoChannelModal } from "../modals/create-channel-video-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";

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
    </>
  );
};
