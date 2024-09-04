import { Avatar, cn } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { RecieveMessage } from "../socket/SocketContent";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

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

  const date = new Date(message.created);

  return (
    <div
      className={cn(
        "flex  items-center gap-2 p-3 border-2 border-blue-600 rounded-md mt-3 mx-6 max-w-[80%] ",
        {
          "self-start": !isSamePerson,
          "self-end": isSamePerson,
        }
      )}
      ref={messagesEndRef}
    >
      {!isSamePerson && (
        <Avatar
          src={message.sender.profile_pic || undefined}
          draggable={false}
          alt={message.sender.full_name || message.sender.username}
          className="flex-shrink-0 pointer-events-none"
        />
      )}
      <div className="flex  flex-col items-start justify-center w-full">
        <h1 className="font-poppins tracking-wider text-sm">
          {message.content}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {date.getHours()}:{date.getMinutes()}
        </p>
      </div>
    </div>
  );
};

export default Message;
