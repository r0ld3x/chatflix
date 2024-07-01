import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Avatar, Card } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useContext, useEffect } from "react";
import { showErrorToast } from "../ShowToast";
import { MessageContext } from "../messages/MessageContext";
import { ContextType } from "./ChatContext";

TimeAgo.addDefaultLocale(en);

const AllChats = ({ data }: { data: ContextType["data"] }) => {
  const { setData, setIsLoading } = useContext(MessageContext);

  const timeAgo = new TimeAgo("en-US");
  const { isPending, isSuccess, isError, isIdle, isPaused, mutate } =
    useMutation({
      mutationFn: async ({ username }: { username: string }) => {
        const session = getAccessToken();
        const api = await getApiClient(session);
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
    if (isPending) {
      setIsLoading(true);
    }
  }, [isPending, setIsLoading]);
  useEffect(() => {
    if (isSuccess || isError || isIdle || isPaused) {
      setIsLoading(false);
    }
  }, [isError, isIdle, isPaused, isPending, isSuccess, setIsLoading]);
  return (
    <Card style={{ height: "100%" }}>
      <div
        className="overflow-y-scroll h-full"
        style={{ height: "calc(100vh - 160px)" }}
      >
        {data.length > 0 ? (
          data.map((data, index) => (
            <div
              className="flex justify-between items-center p-3 ring-1 ring-primary-100 cursor-pointer"
              key={index}
              onClick={() => {
                mutate({ username: data.username });
              }}
            >
              <div className="">
                <Avatar
                  src={
                    data.avatar || `https://api.dicebear.com/8.x/pixel-art/png`
                  }
                  name={data.name}
                />
              </div>
              <div className="flex items-center flex-col gap-0.5 justify-between w-full">
                <div className="flex w-full text-start pl-2 items-center justify-between gap-1">
                  <h1 className="text-pretty text-sm  font-poppins tracking-wide overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[150px]">
                    {data.name}
                  </h1>
                  {/* <div className="flex items-start  gap-2 ">
                    <h1 className="text-[0.6rem] overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]  ">
                      {data.time && timeAgo.format(new Date(data.time))}
                    </h1>
                    <Star className="h-4 w-4" />
                  </div> */}
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
          ))
        ) : (
          <>
            <h1 className="tracking-widest  flex items-center justify-center text-lg outline-2 ">
              No Chat found
            </h1>
          </>
        )}
      </div>
    </Card>
  );
};

export default AllChats;
