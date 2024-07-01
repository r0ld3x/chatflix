import { showErrorToast, showWarningToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { getAccessToken } from "@/lib/helper";
import { getMessages } from "@/types/api/models/ChatTypes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export type RecieveMessage = {
  status: "success" | "fail";
  id: number;
  message: string;
  created: string;
  user: {
    full_name: string;
    profile_pic: string | null;
    username: string;
  };
};

type StreamResponse = {
  addMessage: () => void;
  message: string;
  messages: RecieveMessage[];
  handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  isLoading: boolean;
  isOpen: boolean;
  state: ReadyState;
  fetchNextPage: () => void;
};

export const SocketContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  messages: [],
  handleInputChange: () => {},
  isLoading: false,
  isOpen: false,
  state: ReadyState.CONNECTING,
  fetchNextPage: () => {},
});

interface Props {
  roomUsername: string | null | undefined;
  children: ReactNode;
}

export const SocketContextProvider = ({ roomUsername, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<RecieveMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ReadyState>(ReadyState.UNINSTANTIATED);

  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/ws/chat/` + roomUsername + "/",
    {
      queryParams: {
        token: getAccessToken() ?? "",
      },
      onClose(event) {
        setIsOpen(false);
        setIsLoading(true);
        // router.refresh();
      },
      onError(event) {
        console.log(event);
        setIsOpen(false);
        setIsLoading(true);
      },
      onOpen() {
        setIsOpen(true);
        setIsLoading(false);
      },
    }
  );

  interface Users {
    id: number;
    name: string;
  }

  interface UserQuery {
    pageSize: number;
  }

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: async ({ pageParam }) => {
      const session = getAccessToken();
      const api = await getApiClient(session);
      const res = await api.chat.getMessages({
        username: roomUsername!,
        pageParam,
        page_size: 10,
      });
      if (!res) {
        console.log("res: ", res);
        showWarningToast("Old Messages Failed to Load");
        return null;
      }
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      return lastPage.current_page < lastPage.total_pages
        ? lastPage?.current_page + 1
        : undefined;
    },
    // refetchOnWindowFocus: false, // Optional configuration
    // refetchIntervalInBackground: true, // Optional configuration
  });

  useEffect(() => {
    if (isFetchingNextPage) return setIsLoading(true);
    if (error) return setIsLoading(false);
    if (data) return setIsLoading(false);
  }, [data, error, isFetchingNextPage]);

  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((prevMessages) => [...prevMessages, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    setState(readyState);
  }, [readyState]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    document.title = roomUsername ?? "ChatFlux";
  }, [roomUsername]);

  useEffect(() => {
    if (!data) return;
    const msgs = data.pages as unknown as getMessages[];
    if (msgs.length > 0) {
      console.log("msgs: ", msgs);
      // showErrorToast("Old Messages Failed to Load");
    }
    msgs.map(({ results }) => {
      return results.reverse().map(({ content, created, id, sender }) => {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg.id === id);

          if (!exists) {
            return [
              ...prevMessages,
              {
                created: created,
                id: id,
                message: content,
                status: "success",
                user: sender,
              },
            ];
          }
          return prevMessages;
        });
      });
    });
  }, [data]);

  const addMessage = () => {
    sendJsonMessage({
      type: "chat.message",
      message,
    });
    setMessage("");
  };

  const handleNextPage = () => {
    if (!isFetching || !isFetchingNextPage || hasNextPage) fetchNextPage();
  };

  return (
    <SocketContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
        isOpen,
        state,
        messages,
        fetchNextPage: handleNextPage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
