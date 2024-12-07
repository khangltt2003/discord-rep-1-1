"use client";

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, Copy, DoorOpen, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberRole } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import queryString from "query-string";
import { useRouter } from "next/navigation";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-5 w-5 text-red-400" />,
  MODERATOR: <ShieldCheck className="h-5 w-5 text-blue-400" />,
  GUEST: null,
};

export const ManageMemberModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "manageMember";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { server } = data as { server: ServerWithMembersWithProfiles };

  if (!isMounted) {
    return null;
  }

  const handleChangeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const respose = await axios.patch(url, { role });
      router.refresh();
      onOpen("manageMember", { server: respose.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("manageMember", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-700 text-white p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center font-bold">{`${server?.members?.length} ${server?.members?.length > 1 ? "Members" : "Member"} `}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] p-6">
          {server?.members?.map((member) => {
            return (
              <div key={member.id} className="flex h-[60px] border-y border-neutral-500 ">
                <div className="flex items-center gap-x-2">
                  <UserAvatar src={member.profile.imageUrl} />
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                {member.profile.id !== server.profileId && (
                  <div className="ml-auto my-auto">
                    {loadingId !== member.id ? (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-indigo-500 hover:bg-indigo-600  focus-visible:ring-offset-0 focus-visible:ring-0 "
                            >
                              {member.role}
                              <ChevronDown />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.id, "MODERATOR")}>
                              MODERATOR {member.role === "MODERATOR" && <CheckIcon />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.id, "GUEST")}>
                              GUEST {member.role === "GUEST" && <CheckIcon />}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" className="bg-red-500 hover:bg-red-600" onClick={() => handleKick(member.id)}>
                          Kick
                          <DoorOpen />
                        </Button>
                      </>
                    ) : (
                      <Loader2 className="animate-spin" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
