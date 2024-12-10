"use client";

import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const [isMounted, setIsMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { server } = data;

  if (!isMounted) {
    return null;
  }

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-700 text-white p-0 overflow-hidden font-semibold">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Server invite link</Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-neutral-300/50 border-0 focus-visible:ring-0 text-white text-md fous-visible:ring-offset-0"
              readOnly
              value={inviteUrl}
            />
            <Button disabled={isLoading} size={"icon"} onClick={handleCopyLink} className="bg-green-500">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {isCopied && <p className="text-red-500">copied to clipboard</p>}
          <Button disabled={isLoading} variant="link" size="sm" className="text-xs text-white-500 mt-4" onClick={handleNewLink}>
            Generate a new link
            <RefreshCw className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
