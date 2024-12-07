"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { SettingServerModal } from "@/components/modals/setting-server-modal";
import { ManageMemberModal } from "@/components/modals/manage-member-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";

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
    </>
  );
};
