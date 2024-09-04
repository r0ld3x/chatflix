"use client";

import { Button, ButtonGroup, Divider, Link, Spinner } from "@nextui-org/react";
import { DiamondPercent, User2Icon, Users } from "lucide-react";
import { useContext } from "react";
import AllChats from "./AllChats";
import { ChatContext, ChatContextProvider, ContextType } from "./ChatContext";
import SearchQuery from "./SearchQuery";

const ChatWrapper = ({ data }: { data: ContextType["data"] }) => {
  const { isLoading } = useContext(ChatContext);

  return (
    <ChatContextProvider data={data}>
      <section className="flex-1 flex flex-col h-full ">
        <div className="pt-2 ">
          <ButtonGroup variant="ghost" color="primary" fullWidth>
            <Button
              className="w-full"
              style={{
                borderRadius: 2,
              }}
              variant="solid"
              startContent={<DiamondPercent className="h-4 w-4" />}
              aria-selected
              color="primary"
            >
              All
            </Button>
            <Button
              as={Link}
              style={{
                borderRadius: 2,
              }}
              href="/groups"
              className="w-ful"
              startContent={<Users />}
              isDisabled
            >
              Groups
            </Button>
            <Button
              as={Link}
              style={{
                borderRadius: 2,
              }}
              href="/private"
              className="w-ful"
              startContent={<User2Icon />}
              isDisabled
            >
              Private
            </Button>
          </ButtonGroup>
        </div>
        <Divider className="my-1 bg-primary-500" />
        <SearchQuery />
        <Divider className="my-1 bg-primary-500" />
        {isLoading ? (
          <div
            className="flex-1 flex items-center justify-center h-full
        "
          >
            <Spinner label="Loading..." />
          </div>
        ) : (
          <AllChats data={data} />
        )}
      </section>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
