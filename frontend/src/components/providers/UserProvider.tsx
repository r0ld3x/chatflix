"use client";

import { RetrieveUserResponse } from "@/types/api/models/UserServiceTypes";
import { createContext, ReactNode, useContext } from "react";

export const userContext = createContext<RetrieveUserResponse>({
  email: "",
  image: "",
  name: "",
  username: "",
  id: 0,
});

const UserProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: RetrieveUserResponse;
}) => {
  const { email, id, image, name, username } = useContext(userContext);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserProvider;

export const useUserContext = () => useContext(userContext);
