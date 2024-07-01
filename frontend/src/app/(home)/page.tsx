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
    <div className="px-2  ">
      <div className="flex gap-2">
        <Await promises={[data]}>{(data) => <ChatWrapper data={data} />}</Await>
        <section className="flex-[5]">
          <Await promises={[]}>{() => <MessageWrapper />}</Await>
        </section>
        <InformationWrapper />
      </div>
    </div>
  );
}
