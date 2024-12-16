import { Profile } from "@prisma/client";
import { Hash, LucideMessageSquareText } from "lucide-react";
import ServerSearch from "../servers/server-search";
import { SocketIndicator } from "../socket-indicator";

export const ConversationHeader = ({ memberTwo }: { memberTwo: Profile }) => {
  return (
    <div className="h-12 flex items-center border-b-2 border-neutral-600 px-4 text-neutral-300 font-semibold">
      <LucideMessageSquareText className="5 w-5 mr-2" /> {memberTwo.name}
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};
