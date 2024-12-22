import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import queryString from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async (pageParam?: string) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const response = await axios.get(url);
    //sleep
    await new Promise((r) => setTimeout(r, 1000));
    return response.data;
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => fetchMessages(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000, //refetch when socket fails
  });

  return { data, hasNextPage, fetchNextPage, isFetchingNextPage, status };
};
