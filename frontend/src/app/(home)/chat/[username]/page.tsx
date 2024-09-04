import Await from "@/components/Await";
import ChatWrapper from "@/components/chats/ChatWrapper";
import InformationWrapper from "@/components/info/InformationWrapper";
import Messages from "@/components/messages/MessagesWrapper";
import { getApiClient } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { getRoomInformation } from "@/types/api/models/RoomTypes";

import { getServerSession } from "next-auth/next";

export default async function Home({
  params: { username },
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);

  const api = getApiClient(session);
  let data = api.chat.getAllJoinedChats();
  var roomInfo: getRoomInformation | false = false;
  try {
    const fetch = await api.room.getInformation({ username });
    roomInfo = fetch.data;
  } catch (error) {
    roomInfo = false;
  }

  return (
    <div className="flex max-h-full min-h-full">
      <section className="w-1/4 flex flex-col h-full border-r border-gray-300">
        <Await promises={[data]}>{(data) => <ChatWrapper data={data} />}</Await>
      </section>
      <section className="flex-1 flex flex-col h-full border-r border-gray-300">
        <Messages username={username} />
      </section>
      <section className="w-1/4 flex flex-col h-full">
        <InformationWrapper />
      </section>
    </div>
  );
}
