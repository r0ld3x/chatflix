import Await from "@/components/Await";
import ChatWrapper from "@/components/chats/ChatWrapper";
import InformationWrapper from "@/components/info/InformationWrapper";
import MessageWrapper from "@/components/messages/MessagesWrapper";
import { getApiClient } from "@/lib/api";
import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const api = getApiClient(session);
  let data = api.chat.getAllJoinedChats();

  return (
    <div className="flex max-h-full min-h-full ">
      <section className="w-1/4 p-1 flex flex-col h-full">
        <Await promises={[data]}>{(data) => <ChatWrapper data={data} />}</Await>
      </section>
      <section className="flex-1 p-1 flex flex-col h-full">
        <Await promises={[]}>{() => <MessageWrapper />}</Await>
      </section>
      <section className="w-1/4 p-1 flex flex-col h-full">
        <InformationWrapper />
      </section>
    </div>
  );
}
