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

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";

  const { server } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleDeleteServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");
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
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          Are you sure you want to delete{" "}
          <span className="font-bold">{server?.name}</span> ?
        </div>
        <DialogFooter>
          <div className="px-6  py-3 ml-auto">
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
                  onClick={handleDeleteServer}
                >
                  Delete
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
