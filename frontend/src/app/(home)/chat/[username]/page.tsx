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
    const fetch = await api.room.getRoomInformation({ username });
    roomInfo = fetch.data;
  } catch (error) {
    roomInfo = false;
  }
  return (
    <div className="px-2">
      <div className="flex gap-2">
        <Await promises={[data]}>{(data) => <ChatWrapper data={data} />}</Await>
        <section className="flex-[5]">
          <Messages username={username} />
        </section>
        <InformationWrapper />
      </div>
    </div>
  );
}
