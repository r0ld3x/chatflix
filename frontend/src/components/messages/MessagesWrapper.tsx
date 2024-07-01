"use client";

import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { getRoomInformation } from "@/types/api/models/RoomTypes";
import { Divider, Spinner } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { MessageSquareOff } from "lucide-react";
import { useContext, useEffect } from "react";
import { showErrorToast } from "../ShowToast";
import MessageHeader from "./message/MessageHeader";
import MessageInput from "./message/MessageInput";
import Messages from "./message/Messages";
import { MessageContext } from "./MessageContext";
import { SocketContextProvider } from "./socket/SocketContent";

const MessageWrapper = ({
  username,
}: {
  data?: getRoomInformation | false;
  username?: string | null;
}) => {
  const { data, isLoading, setData, setIsLoading } = useContext(MessageContext);

  const {
    isPending,
    isSuccess,
    isError,
    mutate,
    isIdle,
    isPaused,
    data: response,
  } = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      const session = getAccessToken();
      const api = getApiClient(session);
      const res = await api.room.getRoomInformation({ username });
      return res.data;
    },
    mutationKey: ["getRoomInformation"],
    onError: async (error) => {
      const err = error as Error;
      if (err instanceof ApiError) {
        const msg = err.body;
        for (const [key, value] of Object.entries(msg)) {
          showErrorToast(`${titleize(key)}: ${value}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return;
      } else {
        showErrorToast(err.message);
      }
    },
    onSuccess: async (res) => {
      setData(res);
      window.history.pushState(null, "", `/chat/${res.username}`);
    },
  });

  useEffect(() => {
    setIsLoading(isPending);

    if (isSuccess) {
      setIsLoading(false);
    }

    if (isError) {
      setIsLoading(false);
    }

    if (isIdle || isPaused) {
      setIsLoading(false);
    }
  }, [isPending, isSuccess, isError, isIdle, isPaused, setIsLoading]);

  useEffect(() => {
    if (username) {
      mutate({ username });
    }
  }, [username, mutate]);

  if (isLoading || isPending) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center flex-col">
        <div className="p-6 ring-1 ring-slate-400 rounded-md">
          <MessageSquareOff size={60} className="text-red-500" />
        </div>
        <h1 className="mt-3 tracking-wider font-poppins">Select a chat</h1>
        <p className="mt-1 text-slate-400">
          No chat selected. Please select a chat to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-zinc-50 dark:bg-slate-900 dark:text-white  divide-y divide-zinc-200 flex-col justify-between gap-2 h-[calc(100vh-3.5rem)] ">
      <div className="flex-1 justify-between flex flex-col ">
        <MessageHeader data={data} />
        <Divider className="mt-3" />
        <SocketContextProvider
          roomUsername={username ?? data.username ?? response?.username}
        >
          <>
            <div className="flex-1 justify-between flex flex-col container pr-0">
              <Messages />
            </div>
            <div className="">
              <MessageInput />
            </div>
          </>
        </SocketContextProvider>
      </div>
    </div>
  );
};

export default MessageWrapper;
