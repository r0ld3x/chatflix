import { showWarningToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { getAccessToken } from "@/lib/helper";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export type RecieveMessage = {
  id: number;
  likes_count: number;
  content: string;
  created: string;
  sender: {
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
      onClose() {
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

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
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
        showWarningToast("Old Messages Failed to Load");
        return null;
      }
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
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
    document.title = roomUsername ?? "ChatFlix";
  }, [roomUsername]);

  useEffect(() => {
    if (!data) return;
    const msgs = data.pages;

    if (!msgs || msgs.length === 0) return;

    const flattenedResults = msgs.flatMap((page) =>
      page ? page.results : undefined
    );

    const sortedResults = flattenedResults.toSorted((a, b) => {
      if (!a || !b) return 0;
      return a.id - b.id;
    });
    const validResults = sortedResults.filter((result) => result !== undefined);
    setMessages(validResults);
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
