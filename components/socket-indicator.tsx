"use client";

import { Check, Loader2 } from "lucide-react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-orange-700 border-none">
        Reconnecting
        <Loader2 className="ml-1 w-4 h-4 animate-spin" />
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-green-700 border-none">
      Connected
      <Check className="ml-1 w-4 h-4" />
    </Badge>
  );
};
