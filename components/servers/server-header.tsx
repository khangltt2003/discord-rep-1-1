"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole } from "@prisma/client";
import { ChevronDown, CirclePlus, LogOut, Settings, Trash2, User, UserPlus } from "lucide-react";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isMod = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <div
          className="w-full h-12 text-md font-semibold px-3 flex items-center 
                            border-neutral-200 dark:border-neutral-600 border-b-2 
                          hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition "
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] ">
        {isMod && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("invite", { server: server })}
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMod && (
          <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("createChannel", { server: server })}>
            Create Channel
            <CirclePlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("serverSetting", { server: server })}>
            Server Setting
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("manageMember", { server: server })}>
            Manage Members
            <User className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isMod && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("deleteServer", { server: server })}
          >
            Delete Server
            <Trash2 className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("leaveServer", { server: server })}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
