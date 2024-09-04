import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Avatar } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useContext, useEffect } from "react";
import { MessageContext } from "../messages/MessageContext";
import { showErrorToast } from "../ShowToast";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export default function DisplayChat({
  data,
}: {
  data: {
    name: string;
    avatar: string;
    lastMessage: string;
    username: string;
    time: Date;
  };
}) {
  const {
    setData,
    setIsLoading,
    data: MessageContextData,
  } = useContext(MessageContext);

  const { isPending, mutate } = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      const session = getAccessToken();
      const api = getApiClient(session);
      const res = await api.room.getInformation({ username });
      return res.data;
    },
    mutationKey: ["getInformation"],
    onError: async (error) => {
      if (error instanceof ApiError) {
        const msg = error.body;
        for (const [key, value] of Object.entries(msg)) {
          showErrorToast(`${titleize(key)}: ${value}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } else {
        showErrorToast(error.message);
      }
    },
    onSuccess: async (res) => {
      setData(res);
      window.history.pushState(null, "", `/chat/${res.username}`);
    },
  });

  useEffect(() => {
    if (isPending) setIsLoading(true);
    return () => setIsLoading(false);
  }, [isPending]);

  return (
    <div
      className="flex justify-between items-center p-3 ring-1 ring-primary-100 cursor-pointer"
      onClick={() => {
        if (data.username !== MessageContextData?.username)
          mutate({ username: data.username });
      }}
    >
      <div className="">
        <Avatar
          src={data.avatar || `https://api.dicebear.com/8.x/pixel-art/png`}
          name={data.name}
        />
      </div>
      <div className="flex items-center flex-col gap-0.5 justify-between w-full">
        <div className="flex w-full text-start pl-2 items-center justify-between gap-1">
          <h1 className="text-pretty text-sm  font-poppins tracking-wide overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[150px]">
            {data.name}
          </h1>
          {data.time && (
            <div className="flex items-start  gap-2 ">
              <h1 className="text-[0.6rem] overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]  ">
                {timeAgo.format(new Date(data.time))}
              </h1>
            </div>
          )}
        </div>
        <div className="flex items-center pl-2 justify-between w-full ">
          <h3 className="text-xs text-slate-400 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]  ">
            {data.lastMessage}
          </h3>
          {/* {Math.random() < 0.5 ? (
          <div className="h-3 w-3 bg-emerald-500 rounded-full" />
        ) : (
          <div className="h-3 w-3 bg-slate-700 rounded-full" />
        )} */}
        </div>
      </div>
    </div>
  );
}
