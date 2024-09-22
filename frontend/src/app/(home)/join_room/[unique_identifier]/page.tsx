import { getApiClient } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/types/api";
import { Avatar, Chip, Divider, Link } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { CheckIcon, CreativeCommons, Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import JoinButton from "./JoinButton";

const Page = async ({
  params: { unique_identifier },
}: {
  params: { unique_identifier: string };
}) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const apiClient = getApiClient(session);
  try {
    const res = await apiClient.room.join({
      unique_identifier,
      get_info: true,
    });
    const {
      bio,
      created_at,
      creator,
      name,
      profile_pic,
      total_users,
      updated_at,
      username,
    } = res.data;
    return (
      <main className="bg-[url('/bg.jpg')] flex justify-center items-center min-h-screen">
        <div className="container flex justify-center items-center flex-col">
          <div className="flex flex-col gap-4 items-center justify-center h-full px-6 py-6 border border-primary-300 bg-[#000000bf] shadow-primary-300 shadow-inner rounded-md max-w-72 w-full">
            <div className="w-full">
              <h1 className="font-poppins tracking-wide font-semibold text-lg text-center mb-1">
                Do you wanna join?
              </h1>
              <Divider className="bg-primary-500" />
            </div>

            <div className="">
              <Avatar
                classNames={{
                  base: "w-24 h-24",
                }}
                src={profile_pic ? profile_pic : undefined}
                isBordered
                color="primary"
                name={(name.length > 1 && name) || "chat room pic"}
              />
              <h1 className="text-center pt-2 font-poppins text-lg">{name}</h1>
              {bio && (
                <h5 className="text-center pt-2 text-slate-500 text-sm">
                  {bio}
                </h5>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <Chip
                color="primary"
                radius="md"
                variant="bordered"
                startContent={<CheckIcon size={18} />}
              >
                {username}
              </Chip>
              <Chip
                color="success"
                radius="md"
                variant="bordered"
                startContent={<CreativeCommons size={16} />}
              >
                {formatDistanceToNow(created_at, { addSuffix: true })}
              </Chip>
              <Chip
                color="warning"
                radius="md"
                variant="bordered"
                startContent={<Users size={16} />}
              >
                {total_users}
              </Chip>
              <Chip
                as={Link}
                href={`/user/${creator.username}`}
                target={"_blank"}
                color="default"
                radius="md"
                variant="bordered"
                avatar={
                  <Avatar
                    name={creator.full_name || creator.username}
                    src={
                      creator.profile_pic ??
                      `https://api.dicebear.com/8.x/pixel-art/png`
                    }
                  />
                }
              >
                {creator.full_name || creator.username}
              </Chip>
            </div>
            <JoinButton unique_identifier={unique_identifier} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    let message = [];
    const err = error as Error;
    if (err instanceof ApiError) {
      const msg = err.body;
      for (const [key, value] of Object.entries(msg)) {
        message.push(`${value}`);
      }
    } else {
      message.push(err.message);
    }
    return (
      <main className="bg-[url('/bg.jpg')] flex justify-center items-center min-h-screen">
        <div className="container flex justify-center items-center flex-col">
          <div className="flex flex-col gap-4 items-center justify-center h-full px-6 py-6 border border-primary-300 bg-[#000000bf] shadow-primary-300 shadow-inner rounded-md max-w-72 w-full">
            {message.length > 0 ? (
              message.map((msg, i) => <p key={i}>{msg}</p>)
            ) : (
              <p>Unkown Error</p>
            )}
          </div>
        </div>
      </main>
    );
  }
};

export default Page;
