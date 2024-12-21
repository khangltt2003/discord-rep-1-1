import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSocket } from "@/components/providers/socket-provider";
import { MessageWithMemberProfile } from "@/type";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (updatedMessage: MessageWithMemberProfile) => {
      // console.log("updated message", updatedMessage);
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newPages = oldData.pages.map((page: any) => {
          return {
            ...page,
            messages: page.messages.map((message: MessageWithMemberProfile) => {
              if (message.id === updatedMessage.id) {
                return updatedMessage;
              }
              return message;
            }),
          };
        });

        return { ...oldData, pages: newPages };
      });
    });

    socket.on(addKey, (newMessage: MessageWithMemberProfile) => {
      // console.log("new message", newMessage);
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ messages: [newMessage] }],
          };
        }

        const newPages = [...oldData.pages];
        //add new message to the first page
        newPages[0] = {
          ...newPages[0],
          messages: [newMessage, ...newPages[0].messages],
        };

        return { ...oldData, pages: newPages };
      });
    });

    socket.onAny((event, ...args) => {
      console.log(`[Socket.IO Event Triggered]: "${event}" with args:`, args);
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, queryKey, addKey, updateKey]);
};
