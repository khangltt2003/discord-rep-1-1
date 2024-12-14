"use client";

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import axios from "axios";
// import { initialConversation } from "@/lib/initial-conversation";
// import { currentProfile } from "@/lib/current-profile";

export const CreateConversation = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "createConversation";

  const { profile } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleCreateConversation = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/conversations", { memberTwoId: profile?.id });

      router.refresh();
      onClose();
      router.push(`/conversations/${response.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-700 text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Create Conversation</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          Do you want to chat with <span className="font-bold">{profile?.name}</span> ?
        </div>
        <DialogFooter>
          <div className="px-6  py-3 ml-auto">
            {!isLoading ? (
              <>
                <Button variant={"link"} onClick={() => onClose()} className="focus-visible:ring-0 focus-visible:ring-offset-0">
                  Cancel
                </Button>
                <Button variant={"destructive"} className="bg-red-600 hover:bg-red-700" onClick={handleCreateConversation}>
                  Chat
                </Button>
              </>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
