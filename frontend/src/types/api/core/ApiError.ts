import { AxiosResponse } from "axios";

export type ApiResult = {
  readonly url: string;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly body: any;
};

export class ApiError extends Error {
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: any;
  public readonly request: AxiosResponse;

  constructor(request: AxiosResponse, response: ApiResult, message: string) {
    super(message);

    this.name = "ApiError";
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = response.body;
    this.request = request;
  }
}
