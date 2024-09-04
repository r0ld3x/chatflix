"use client";
import { getRoomInformation } from "@/types/api/models/RoomTypes";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
  Spinner,
} from "@nextui-org/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Aladin } from "next/font/google";
import { useContext } from "react";
import { MessageContext } from "../messages/MessageContext";
import MemberLists from "./MemberLists";

const aladin = Aladin({
  weight: "400",
  subsets: ["latin"],
});

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const InformationWrapper = () => {
  const { data, isLoading } = useContext(MessageContext);
  if (isLoading) return <Spinner />;

  if (!data) return <></>;
  return (
    <div className="flex-1 flex flex-col h-full ">
      <RoomDetails data={data} />
      <Divider className="my-2" />
      <MemberLists data={data} />
    </div>
  );
};

export default InformationWrapper;

function RoomDetails({ data }: { data: getRoomInformation }) {
  return (
    <Card className=" " radius="none">
      <CardHeader className="items-center justify-center ">
        <Avatar
          size="lg"
          className="h-48 w-48"
          src={
            data?.profile_pic || `https://api.dicebear.com/8.x/pixel-art/png`
          }
          alt={data?.creator.full_name}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-3">
          <h3
            className={`text-2xl ${aladin.className} text-center tracking-wider font-semibold `}
          >
            {data?.name}
          </h3>
          {data?.bio && <h5 className="text-xs font-mono">{data.bio}</h5>}
          <Divider />
          <div className="flex items-center justify-between container gap-1">
            <h3 className=" tracking-wide font-semibold text-medium">
              Creator:
            </h3>
            <Link
              className="cursor-pointer flex gap-1"
              href={`/user/${data?.creator.username}`}
            >
              <Avatar
                src={
                  data?.creator.profile_pic ||
                  `https://api.dicebear.com/8.x/pixel-art/png`
                }
                size="sm"
              />
              {data?.creator.full_name || data?.creator.username}
            </Link>
          </div>
          <Divider />
          <div className="flex items-center justify-between container gap-1">
            <h3 className=" tracking-wide font-semibold text-medium">
              Created at:
            </h3>
            <h4 className="font-poppins font-semibold tracking-wide">
              {data?.created_at && timeAgo.format(new Date(data.created_at))}
            </h4>
          </div>
          <Divider />

          <div className="flex items-center justify-between container gap-1">
            <h3 className=" tracking-wide font-semibold text-medium">
              Total Members:
            </h3>
            <h4 className="font-poppins font-semibold tracking-wide">
              {data.total_users}
            </h4>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
