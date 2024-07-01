"use client";

import All from "./All";
import { ChatContextProvider, ContextType } from "./ChatContext";

const ChatWrapper = ({ data }: { data: ContextType["data"] }) => {
  return (
    <ChatContextProvider data={data}>
      <div className="relative min-h-full bg-zinc-50 dark:bg-slate-900 dark:text-white  divide-y divide-zinc-200 flex-col justify-between gap-2 h-[calc(100vh-3.5rem)] ">
        <div className="flex-1 justify-between flex flex-col ">
          <All />
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
