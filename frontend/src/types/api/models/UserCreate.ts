/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserCreate = {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  email: string;
  password: string;
};

export type UserActivate = {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  uid: string;
  token: string;
};

export type UserActivateData = {
  uid: string;
  token: string;
};

export interface UserCreateResponse {
  email: string;
  id: number;
}

export interface UserActivateDataResponse {
  id: number;
  email: string;
  image: string;
  name: string;
  username: string;
  is_active: boolean;
}
