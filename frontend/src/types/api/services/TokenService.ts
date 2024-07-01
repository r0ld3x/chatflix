/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {
  TokenObtainPair,
  TokenObtainPairResponse,
} from "../models/TokenObtainPair";
import type { TokenRefreshResponse } from "../models/TokenRefresh";

import { AxiosInstance, AxiosResponse } from "axios";

export class TokenService {
  constructor(public readonly axios: AxiosInstance) {}

  /**
   * Takes a set of user credentials and returns an access and refresh JSON web
   * token pair to prove the authentication of those credentials.
   * @param requestBody
   * @returns TokenObtainPairResponse
   * @throws ApiError
   */
  public tokenCreate(
    requestBody: TokenObtainPair
  ): Promise<AxiosResponse<TokenObtainPairResponse>> {
    return this.axios.post("/api/jwt/create/", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Takes a refresh type JSON web token and returns an access type JSON web
   * token if the refresh token is valid.
   * @param requestBody
   * @returns TokenRefresh
   * @throws ApiError
   */
  public tokenRefreshCreate(
    refresh: string
  ): Promise<AxiosResponse<TokenRefreshResponse>> {
    return this.axios.post(
      "/api/jwt/refresh/",
      {
        refresh,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }
}
