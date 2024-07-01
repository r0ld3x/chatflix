import { AxiosInstance, AxiosResponse } from "axios";
import { RoomCreator, getRoomInformation } from "../models/RoomTypes";

export interface HttpResponse<T> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export interface RoomCreateType {
  name: string;
  username: string;
  bio: string | null;
  profile_pic: string | null;
  is_public: boolean;
}

interface JoinRoomOptions {
  get_info?: boolean;
}

export class RoomsService {
  constructor(public readonly axios: AxiosInstance) {}

  /**
   * @param requestBody
   * @returns UserCreate
   * @throws ApiError
   */
  public async create({
    name,
    username,
    profilePic,
  }: {
    name: string;
    username: string;
    profilePic?: File;
  }): Promise<AxiosResponse<RoomCreator>> {
    const form = new FormData();
    form.append("name", name);
    form.append("username", username);
    if (profilePic) {
      form.append("profile_pic", profilePic);
    }
    return this.axios.post("/room/create", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  public async getRoomInformation({
    username,
  }: {
    username?: string;
  } = {}): Promise<AxiosResponse<getRoomInformation>> {
    return this.axios.get("/room/information/", {
      params: { username },
    });
  }
  public async JoinRoom({
    unique_identifier,
    get_info = false,
  }: {
    unique_identifier: string;
    get_info?: boolean;
  }): Promise<AxiosResponse<getRoomInformation>> {
    let params = {};

    if (get_info) {
      params = {
        get_info,
      };
    }
    return this.axios.get(`/room/join_room/${unique_identifier}/`, {
      params,
    });
  }
  public async CreateJoinRoomLink({ username }: { username: string }): Promise<
    AxiosResponse<{
      link: string;
      identifier: string;
    }>
  > {
    return this.axios.get(`/room/generate_link/${username}/`, {});
  }
}
