import { Button, Divider, Textarea } from "@nextui-org/react";
import { Send } from "lucide-react";
import { useContext, useRef } from "react";
import { ReadyState } from "react-use-websocket";
import { SocketContext } from "../socket/SocketContent";
interface MessageInputProps {
  disabled?: boolean;
}

const MessageInput = ({ disabled }: MessageInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { addMessage, handleInputChange, isLoading, isOpen, message, state } =
    useContext(SocketContext);

  return (
    <div className="container py-4">
      <div className="w-full">
        <Textarea
          rows={1}
          ref={textAreaRef}
          maxRows={1}
          autoFocus
          variant="bordered"
          color="success"
          className=" resize-none text-base   "
          onChange={handleInputChange}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addMessage();
              textAreaRef.current?.focus();
            }
          }}
          endContent={
            <Button
              className=""
              isDisabled={
                isLoading || state !== ReadyState.OPEN || !isOpen || disabled
              }
              aria-label="send message"
              variant="bordered"
              color="success"
              onClick={(e) => {
                e.preventDefault();
                addMessage();
                textAreaRef.current?.focus();
              }}
            >
              <Send className="h-4 w-4" aria-label="send message" />
            </Button>
          }
          disabled={
            isLoading || state !== ReadyState.OPEN || !isOpen || disabled
          }
          placeholder="Enter your message"
        />
      </div>
      <div className="">
        <Divider className="" />
      </div>
    </div>
  );
};

export default MessageInput;
