import { ContextType } from "@/components/chats/ChatContext";
import { AxiosInstance, AxiosResponse } from "axios";
import { getMessages } from "../models/ChatTypes";

export interface HttpResponse<T> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export class ChatsService {
  constructor(public readonly axios: AxiosInstance) {}

  /**
   * @param requestBody
   * @returns UserCreate
   * @throws ApiError
   */
  public async getAllJoinedChats({
    username,
  }: {
    username?: string;
  } = {}): Promise<ContextType["data"] | []> {
    try {
      const result: AxiosResponse<ContextType["data"]> = await this.axios.get(
        "/chat/",
        {
          params: { username },
        }
      );
      if (!result || !result.data) {
        return [];
      }
      return result.data;
    } catch (error) {
      return [];
    }
  }

  public async getMessages({
    username,
    pageParam,
    page_size,
  }: {
    username: string;
    pageParam: number;
    page_size?: number;
  }): Promise<AxiosResponse<getMessages>> {
    return await this.axios.get("/chat/messages/", {
      params: {
        username,
        page: pageParam !== 0 ? pageParam : 1,
        page_size,
      },
    });
  }
}
