// @ts-nocheck

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApiClient } from "./api";

const decodeToken = (
  token: string
): {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
} => {
  return JSON.parse(atob(token.split(".")[1]));
};

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    verifyRequest: "/activate",
  },
  callbacks: {
    session: async ({ session, token, user, newSession, trigger }) => {
      const access = decodeToken(token.access);
      const refresh = decodeToken(token.refresh);
      if (Date.now() / 1000 > access.exp && Date.now() / 1000 > refresh.exp) {
        return Promise.reject({
          error: new Error("Refresh token expired"),
        });
      }
      session.refresh = token.refresh;
      session.access = token.access;
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user?.email) {
        return { ...token, ...user };
      }
      if (Date.now() / 1000 > decodeToken(token?.access).exp) {
        const apiClient = await getApiClient();
        const res = await apiClient.token.tokenRefreshCreate(token?.refresh);

        token.access = res.data.access;
      }

      return { ...token, ...user };
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials === undefined) {
          return null;
        }
        try {
          const apiClient = await getApiClient();
          const res = await apiClient.token.tokenCreate({
            email: credentials.email,
            password: credentials.password,
            re_password: credentials.password,
          });
          // console.log({
          //   id: decodeToken(res.data.access).user_id,
          //   email: credentials.email,
          //   access: res.data.access,
          //   refresh: res.data.refresh,
          // });
          return {
            id: decodeToken(res.data.access).user_id,
            email: credentials.email,
            access: res.data.access,
            refresh: res.data.refresh,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
};

export { authOptions };
