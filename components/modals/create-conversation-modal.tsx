"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

const formatDate = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Use toLocaleDateString for consistent formatting
  return date.toLocaleDateString("en-US", options);
};

export const CreateConversation = () => {
  const [createdDate, setCreatedDate] = useState("Dec 6, 2024");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const isModalOpen = isOpen && type === "createConversation";

  const { profile } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (profile) {
      console.log(profile.createdAt);
      setCreatedDate(formatDate(profile.createdAt));
    }
  }, [profile]);

  if (!isMounted) {
    return null;
  }

  const handleCreateConversation = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/conversations", {
        memberTwoId: profile?.id,
      });

      router.refresh();
      onClose();
      router.push(`/conversations/${response.data.conversation.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-800 text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6 hidden">
          <DialogTitle />
        </DialogHeader>
        <div className="w-full h-full  rounded-lg text-white mb-10 ">
          <div className={cn(`h-36 w-full relative mb-10`, profile?.wallpaper)}>
            <UserAvatar
              src={profile?.imageUrl}
              className="abolute left-6 top-[100%] translate-y-[-50%]  md:h-16 md:w-16 ring-[6px] ring-[#1c1c1c]"
            />
          </div>

          <div className="flex flex-col  items-start px-4 text-neutral-300">
            <h1 className="text-xl font-semibold leading-6 mb-1">
              {profile?.name}
            </h1>
            <p className="text-sm mb-5">{profile?.email}</p>
            <div className="bg-neutral-700  w-full rounded-xl p-3">
              <p className="text-sm font-medium leading-6 mb-1">Member Since</p>
              <p className="text-base">{createdDate}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="px-4  py-3 ml-auto">
            {!isLoading ? (
              <>
                <Button
                  variant={"link"}
                  onClick={() => onClose()}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Cancel
                </Button>
                <Button
                  variant={"destructive"}
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCreateConversation}
                >
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
