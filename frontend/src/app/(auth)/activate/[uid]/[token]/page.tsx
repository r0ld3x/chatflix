import { getApiClient } from "@/lib/api";
import { Button, Code, Divider, Link } from "@nextui-org/react";
import ActivateButton from "./ActivateButton";

const Page = async ({
  params: { uid, token },
}: {
  params: { uid: string; token: string };
}) => {
  const api = await getApiClient();
  try {
    const res = await api.user.usersActivateData({ uid, token });
    return (
      <main className="bg-[url('/bg.jpg')] flex justify-center items-center min-h-screen">
        <div className="container flex justify-center items-center flex-col">
          <div className="flex flex-col gap-4 items-center justify-center h-full w-fit px-6 py-6 border border-primary-300 bg-[#000000bf] shadow-primary-300 shadow-inner rounded-md ">
            <div className="w-full">
              <h1 className="font-poppins tracking-wider font-semibold text-lg text-center mb-1">
                Activate Your Account
              </h1>
              <Divider className="bg-primary-500" />
            </div>
            <div className="space-y-2">
              <h3>
                Your Email is:{" "}
                <span>
                  <Code
                    color="primary"
                    style={{
                      textOverflow: "ellipsis",
                      wordBreak: "break-all",
                      whiteSpace: "normal",
                    }}
                  >
                    {res.data.email}
                  </Code>
                </span>
              </h3>
              <h3>
                Your Temp Username is:{" "}
                <span>
                  <Code color="primary">{res.data.username}</Code>
                </span>
              </h3>
            </div>
            <ActivateButton uid={uid} token={token} />
          </div>
        </div>
      </main>
    );
  } catch (err) {
    return (
      <main className="bg-[url('/bg.jpg')] flex justify-center items-center min-h-screen">
        <div className="container flex justify-center items-center flex-col">
          <div className="flex flex-col gap-4 items-center justify-center h-full w-fit px-6 py-8 border border-primary-300 bg-[#000000bf] shadow-primary-300 shadow-inner rounded-md">
            Your account is already activated you can login now.
            <Button
              as={Link}
              href="/login"
              variant="solid"
              color="primary"
              size="lg"
              className="w-full mt-4"
            >
              Login
            </Button>
          </div>
        </div>
      </main>
    );
  }
};

export default Page;
