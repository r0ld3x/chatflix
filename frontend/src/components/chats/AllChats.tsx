import { Card } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { ContextType } from "./ChatContext";
import DisplayChat from "./DisplayChat";

const AllChats = ({ data }: { data: ContextType["data"] }) => {
  const nd = [
    {
      name: "Alice",
      avatar: "http://example.com/avatars/alice.png",
      lastMessage: "Hey there!",
      username: "alice123",
      time: new Date("2024-08-23T10:00:00Z"),
    },
    {
      name: "Bob",
      avatar: "http://example.com/avatars/bob.png",
      lastMessage: "Good morning!",
      username: "bob456",
      time: new Date("2024-08-23T10:15:30Z"),
    },
    {
      name: "Charlie",
      avatar: "http://example.com/avatars/charlie.png",
      lastMessage: "Are you free today?",
      username: "charlie789",
      time: new Date("2024-08-23T11:00:00Z"),
    },
    {
      name: "David",
      avatar: "http://example.com/avatars/david.png",
      lastMessage: "Let's catch up soon.",
      username: "david101",
      time: new Date("2024-08-23T12:30:45Z"),
    },
    {
      name: "Eva",
      avatar: "http://example.com/avatars/eva.png",
      lastMessage: "Looking forward to it!",
      username: "eva202",
      time: new Date("2024-08-23T13:20:30Z"),
    },
    {
      name: "Frank",
      avatar: "http://example.com/avatars/frank.png",
      lastMessage: "I'll call you later.",
      username: "frank303",
      time: new Date("2024-08-23T14:45:00Z"),
    },
    {
      name: "Grace",
      avatar: "http://example.com/avatars/grace.png",
      lastMessage: "Thanks for your help!",
      username: "grace404",
      time: new Date("2024-08-23T15:15:30Z"),
    },
    {
      name: "Hannah",
      avatar: "http://example.com/avatars/hannah.png",
      lastMessage: "See you soon!",
      username: "hannah505",
      time: new Date("2024-08-23T16:00:00Z"),
    },
    {
      name: "Ivy",
      avatar: "http://example.com/avatars/ivy.png",
      lastMessage: "Can you send me that file?",
      username: "ivy606",
      time: new Date("2024-08-23T17:30:15Z"),
    },
    {
      name: "Jack",
      avatar: "http://example.com/avatars/jack.png",
      lastMessage: "Check out this link.",
      username: "jack707",
      time: new Date("2024-08-23T18:00:00Z"),
    },
    {
      name: "Kara",
      avatar: "http://example.com/avatars/kara.png",
      lastMessage: "Great job today!",
      username: "kara808",
      time: new Date("2024-08-23T19:10:45Z"),
    },
    {
      name: "Liam",
      avatar: "http://example.com/avatars/liam.png",
      lastMessage: "Are we still on for lunch?",
      username: "liam909",
      time: new Date("2024-08-23T20:00:00Z"),
    },
    {
      name: "Mia",
      avatar: "http://example.com/avatars/mia.png",
      lastMessage: "I’ll be there in 10 minutes.",
      username: "mia1010",
      time: new Date("2024-08-23T21:30:15Z"),
    },
    {
      name: "Nate",
      avatar: "http://example.com/avatars/nate.png",
      lastMessage: "Got your message, thanks!",
      username: "nate1111",
      time: new Date("2024-08-23T22:15:00Z"),
    },
    {
      name: "Olivia",
      avatar: "http://example.com/avatars/olivia.png",
      lastMessage: "How was the event?",
      username: "olivia1212",
      time: new Date("2024-08-23T23:00:00Z"),
    },
    {
      name: "Paul",
      avatar: "http://example.com/avatars/paul.png",
      lastMessage: "I'll meet you at the usual place.",
      username: "paul1313",
      time: new Date("2024-08-24T08:00:00Z"),
    },
    {
      name: "Quinn",
      avatar: "http://example.com/avatars/quinn.png",
      lastMessage: "Thanks for the update.",
      username: "quinn1414",
      time: new Date("2024-08-24T09:00:00Z"),
    },
    {
      name: "Riley",
      avatar: "http://example.com/avatars/riley.png",
      lastMessage: "Let's review the plans tomorrow.",
      username: "riley1515",
      time: new Date("2024-08-24T10:15:30Z"),
    },
    {
      name: "Sarah",
      avatar: "http://example.com/avatars/sarah.png",
      lastMessage: "I’m running late.",
      username: "sarah1616",
      time: new Date("2024-08-24T11:00:00Z"),
    },
    {
      name: "Tom",
      avatar: "http://example.com/avatars/tom.png",
      lastMessage: "Here’s the document you requested.",
      username: "tom1717",
      time: new Date("2024-08-24T12:30:00Z"),
    },
    {
      name: "Uma",
      avatar: "http://example.com/avatars/uma.png",
      lastMessage: "Can you review this?",
      username: "uma1818",
      time: new Date("2024-08-24T13:20:15Z"),
    },
    {
      name: "Vera",
      avatar: "http://example.com/avatars/vera.png",
      lastMessage: "Let’s discuss this further.",
      username: "vera1919",
      time: new Date("2024-08-24T14:00:00Z"),
    },
    {
      name: "Will",
      avatar: "http://example.com/avatars/will.png",
      lastMessage: "All set for tomorrow.",
      username: "will2020",
      time: new Date("2024-08-24T15:30:30Z"),
    },
  ];
  const [isScrollable, setIsScrollable] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, [data]);

  return (
    <Card
      className={`flex-1 flex flex-col h-full ${isScrollable ? "pb-10" : ""}`}
      radius="none"
    >
      <div ref={contentRef} className="flex-1 overflow-y-scroll h-full">
        {data.length > 0 ? (
          data.map((data) => <DisplayChat data={data} key={data.username} />)
        ) : (
          <h1 className="tracking-widest flex items-center justify-center text-lg">
            No Chat found
          </h1>
        )}
      </div>
    </Card>
  );
};

export default AllChats;
