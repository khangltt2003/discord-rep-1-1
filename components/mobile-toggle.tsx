import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import React from "react";
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import { ServerSidebar } from "./servers/server-sidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="mr-2 md:hidden" />
      </SheetTrigger>
      <SheetContent className="flex fixed inset-y-0 p-0" side={"left"}>
        <div className="flex h-full w-[72px] z-30 flex-col">
          <NavigationSidebar />
        </div>
        <div className=" w-80 z-20 inset-y-0 bg-[#76747e2f]">
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
