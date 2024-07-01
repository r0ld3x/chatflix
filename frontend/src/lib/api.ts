import { ApiClient } from "@/types/api/ApiClient";
import { Session } from "next-auth";

const getApiClient = (session?: Session | string | null) => {
  let authorizationHeader: string | undefined;

  if (session) {
    if (typeof session === "string") {
      authorizationHeader = `Bearer ${session}`;
    } else if (typeof session === "object" && "access" in session) {
      authorizationHeader = `Bearer ${session.access}`;
    }
  }
  return new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      ...(authorizationHeader && { Authorization: authorizationHeader }),
    },
  });
};

export { getApiClient };
