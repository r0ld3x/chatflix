import { AxiosInstance, AxiosResponse } from "axios";
import {
  UserActivate,
  UserActivateData,
  UserActivateDataResponse,
  UserCreate,
  UserCreateResponse,
} from "../models/UserCreate";
import { RetrieveUserResponse } from "../models/UserServiceTypes";

export interface HttpResponse<T> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export class UsersService {
  constructor(public readonly axios: AxiosInstance) {}

  /**
   * @param requestBody
   * @returns UserCreate
   * @throws ApiError
   */
  public usersCreate({
    email,
    password,
  }: UserCreate): Promise<AxiosResponse<UserCreateResponse>> {
    return this.axios.request({
      method: "POST",
      url: "/auth/users/",
      data: { email, password, re_password: password },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * @param requestBody
   * @returns UserCreate
   * @throws ApiError
   */
  public usersActivateData({
    uid,
    token,
  }: UserActivateData): Promise<AxiosResponse<UserActivateDataResponse>> {
    return this.axios.request({
      method: "GET",
      url: "/api/activate/",
      params: { uid, token },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * @param requestBody
   * @returns UserCreate
   * @throws ApiError
   */
  public usersActivate(
    requestBody: UserActivate
  ): Promise<AxiosResponse<UserCreateResponse>> {
    return this.axios.request({
      method: "POST",
      url: "/auth/users/activation/",
      data: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Takes a set of user credentials and returns an access and refresh JSON web
   * token pair to prove the authentication of those credentials.
   * @param requestBody
   * @returns TokenObtainPairResponse
   * @throws ApiError
   */
  public async retrieveMe(): Promise<RetrieveUserResponse | false> {
    try {
      const result: AxiosResponse<RetrieveUserResponse> = await this.axios.get(
        "/api/user/"
      );
      if (!result || !result.data) {
        return false;
      }
      return result.data;
    } catch (error) {
      return false;
    }
  }
}
