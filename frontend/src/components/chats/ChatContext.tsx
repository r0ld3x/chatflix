import { ReactNode, createContext, useEffect, useState } from "react";

function debounce(callback: () => void, delay: number | undefined) {
  let timeoutId: string | number | NodeJS.Timeout | undefined;

  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

export type ContextType = {
  query: string;
  data: {
    name: string;
    avatar: string;
    lastMessage: string;
    username: string;
    time: Date;
  }[];
  setQuery: (query: string) => void;
  isLoading: boolean;
  isQueryLoading: boolean;
  setData: (
    data: {
      name: string;
      avatar: string;
      lastMessage: string;
      username: string;
      time: Date;
    }[]
  ) => void;
};

export const ChatContext = createContext<ContextType>({
  query: "",
  data: [],
  setData: () => {},
  setQuery: () => {},
  isLoading: false,
  isQueryLoading: false,
});

export const ChatContextProvider = ({
  data: initialData,
  children,
}: {
  data: ContextType["data"];
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);
  const [data, setData] = useState<ContextType["data"]>([]);
  const [query, setQuery] = useState<ContextType["query"]>("");
  const handleSetQuery = (e: string) => {
    setIsQueryLoading(true);
    debounce(() => setQuery(e.trim()), 2000);
  };

  useEffect(() => {
    setData(initialData);
    setIsLoading(false);
  }, [initialData]);

  const handleInputChange = (data: ContextType["data"]) => {
    setIsLoading(true);
    setData(data);
    setIsLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        data,
        query,
        setData(data) {
          handleInputChange(data);
        },
        setQuery(query) {
          handleSetQuery(query);
        },
        isLoading,
        isQueryLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
