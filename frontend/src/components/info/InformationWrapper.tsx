"use client";
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

const aladin = Aladin({
  weight: "400",
  subsets: ["latin"],
});

TimeAgo.addDefaultLocale(en);

const InformationWrapper = () => {
  const { data, isLoading } = useContext(MessageContext);
  if (isLoading) return <Spinner />;
  const timeAgo = new TimeAgo("en-US");
  if (!data) return <></>;
  return (
    <section className="flex-[2]">
      <Card radius="none">
        <CardHeader className="items-center justify-center">
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
          <h3
            className={`text-2xl ${aladin.className} text-center tracking-wider font-semibold `}
          >
            {data?.name}
          </h3>
          <h5 className="text-xs font-mono">{data?.bio}</h5>
        </CardBody>
        <Divider />
        <CardBody>
          <div className="flex items-center justify-start gap-1">
            <h3 className="font-poppins font-semibold text-medium">Creator:</h3>
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
        </CardBody>
        <Divider />
        <CardBody>
          <div className="flex items-center justify-start gap-1">
            <h3 className="font-poppins font-semibold text-medium">
              Created at:
            </h3>
            <h4 className="font-poppins">
              {data?.created_at && timeAgo.format(new Date(data.created_at))}
            </h4>
          </div>
        </CardBody>
        <Divider />
      </Card>
    </section>
  );
};

export default InformationWrapper;
