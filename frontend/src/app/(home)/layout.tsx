import type { Metadata } from "next";

import { MessageContextProvider } from "@/components/messages/MessageContext";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "ChatFlux",
  description: "Chatting App",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const apiClient = getApiClient(session);
  const user = await apiClient.user.retrieveMe();
  if (!user) return redirect("/login");

  return (
    <main className="h-screen max-h-screen min-h-screen flex flex-col ">
      <div className="flex-shrink-0">
        <NavBar user={user} />
      </div>
      <MessageContextProvider>{children}</MessageContextProvider>
    </main>
  );
};

export default Layout;
