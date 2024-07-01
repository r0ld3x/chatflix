"use client";
import { getRoomInformation } from "@/types/api/models/RoomTypes";
import { createContext, ReactNode, useState } from "react";

// Define the types of your context
export type MessageContextType = {
  data: getRoomInformation | null;
  isLoading: boolean;
  setData: (data: getRoomInformation) => void;
  setIsLoading: (state: boolean) => void;
};

export const MessageContext = createContext<MessageContextType>({
  data: null,
  setData: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const MessageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setLocalIsLoading] = useState<boolean>(false);
  const [data, setLocalData] = useState<getRoomInformation | null>(null);

  const handleInputChange = (newData: getRoomInformation) => {
    setLocalIsLoading(true);
    setLocalData(newData);
    setLocalIsLoading(false);
  };

  return (
    <MessageContext.Provider
      value={{
        data,
        setData: handleInputChange,
        isLoading,
        setIsLoading: setLocalIsLoading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
