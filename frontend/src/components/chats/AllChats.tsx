import { Card } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { ContextType } from "./ChatContext";
import DisplayChat from "./DisplayChat";

const AllChats = ({ data }: { data: ContextType["data"] }) => {
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
