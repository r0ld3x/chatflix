import { Avatar, cn } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { RecieveMessage } from "../socket/SocketContent";

const Message = ({
  message,
  isSamePerson,
}: {
  message: RecieveMessage;
  isSamePerson: boolean;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex relative self-start items-center gap-4 p-3 border-2 border-blue-600 rounded-md mt-3 max-w-[80%]",
          {
            "self-start": !isSamePerson,
            "self-end": isSamePerson,
          }
        )}
        ref={messagesEndRef}
      >
        <Avatar
          src={message.user.profile_pic || undefined}
          draggable={false}
          alt={message.user.full_name || message.user.username}
          className="flex-shrink-0 pointer-events-none"
        />
        <div className="flex flex-col items-start justify-center ">
          <h1 className="font-poppins tracking-wider text-sm">
            {message.message}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Message;
