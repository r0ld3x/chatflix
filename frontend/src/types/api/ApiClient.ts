import { getRefreshToken } from "@/lib/helper";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "./core/ApiError";
import { ChatsService } from "./services/ChatService";
import { RoomsService } from "./services/RoomService";
import { TokenService } from "./services/TokenService";
import { UsersService } from "./services/UsersService";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
export class ApiClient {
  public readonly token: TokenService;
  public readonly user: UsersService;
  public readonly chat: ChatsService;
  public readonly room: RoomsService;

  public readonly axiosInstance: AxiosInstance;

  constructor(config?: Partial<AxiosRequestConfig>) {
    this.axiosInstance = axios.create({
      baseURL: config?.baseURL ?? "",
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig;
        if (!originalRequest) {
          return Promise.reject(error);
        }
        if (error.response) {
          const { status } = error.response;
          if ((status === 401 || status === 403) && !originalRequest._retry) {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
              const keys = await this.token.tokenRefreshCreate(refreshToken);
              if (!keys.data.access) {
                throw new Error("Cannot get new access token");
              }
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${keys.data.access}`;
              window.localStorage.setItem("access", keys.data.access);
              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }
          if (status === 404) {
            const apiError = new ApiError(
              error.response,
              {
                ok: false,
                url: originalRequest.url!,
                status,
                statusText: error.response.statusText,
                body: { message: "Invalid Api" },
              },
              JSON.stringify(error.response.data, null, 2)
            );
            return Promise.reject(apiError);
          }
          const apiError = new ApiError(
            error.response,
            {
              ok: false,
              url: originalRequest.url!,
              status,
              statusText: error.response.statusText,
              body: error.response.data,
            },
            JSON.stringify(error.response.data, null, 2)
          );

          return Promise.reject(apiError);
        }
        return Promise.reject(error);
      }
    );

    this.token = new TokenService(this.axiosInstance);
    this.user = new UsersService(this.axiosInstance);
    this.chat = new ChatsService(this.axiosInstance);
    this.room = new RoomsService(this.axiosInstance);
  }
}
