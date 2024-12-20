import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import NavigationAction from "@/components/navigation/navigation-action";
import NavigationItem from "@/components/navigation/navigation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import NavigationConversation from "./navigation-conversation";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full  py-3 bg-[#909090] dark:bg-[#1b1b1b] border-r-2 border-neutral-800">
      <div>
        <NavigationConversation />
      </div>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto " />
      <ScrollArea className="w-full h-[90%]">
        {servers.map((server) => {
          return (
            <div key={server.id} className="mb-2">
              <NavigationItem key={server.id} id={server.id} imageUrl={server.imageUrl} name={server.name} />
            </div>
          );
        })}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        {/* <ModeToggle /> */}
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto " />

        <NavigationAction />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
