import { showErrorToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { getAccessToken } from "@/lib/helper";
import { RetrieveUserResponse } from "@/types/api/models/UserServiceTypes";
import { Chip, Spinner } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ReadyState } from "react-use-websocket";
import { SocketContext } from "../socket/SocketContent";
import Message from "./Message";

const Messages = () => {
  const session = getAccessToken();

  const [user, setUser] = useState<RetrieveUserResponse>();

  const fetchUser = useCallback(() => {
    const getUser = async () => {
      try {
        const apiClient = getApiClient(session);
        const me = await apiClient.user.retrieveMe();
        if (!me) {
          showErrorToast("Please re-login.");
        } else {
          setUser(me);
        }
      } catch (error) {
        showErrorToast("Failed to fetch user information.");
      }
    };
    getUser();
  }, [session]);

  useEffect(() => {
    fetchUser();
  }, []);

  const { messages, state, fetchNextPage, hasNextPage } =
    useContext(SocketContext);
  const { ref, inView } = useInView({
    fallbackInView: true,
    initialInView: true,
  });

  useEffect(() => {
    if (inView && hasNextPage && state === ReadyState["OPEN"]) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex items-center gap-4 flex-col relative ">
      {ReadyState.OPEN !== state && (
        <div className="absolute top-2 left-50 transform-cpu transition-transform ease-in-out duration-400">
          <Chip color="primary" className=" bg-current/20 ring-1 ring-blue-500">
            Current status is {ReadyState[state]}
          </Chip>
        </div>
      )}
      <div className="flex w-full flex-col flex-1 overflow-y-scroll h-full py-2">
        {hasNextPage && (
          <>
            <div
              className=" cursor-pointer flex w-full items-center justify-center py-2"
              onClick={fetchNextPage}
              ref={ref}
            >
              <Spinner label="loading more messages" />
            </div>
            <div className="mt-14"></div>
          </>
        )}
        {messages.map((message) => (
          <Message
            message={message}
            isSamePerson={message.sender.username === user?.username}
            key={message.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Messages;
