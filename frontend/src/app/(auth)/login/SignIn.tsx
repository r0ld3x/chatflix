"use client";

import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { setTimeout } from "timers";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      const apiClient = getApiClient();
      const res2 = await apiClient.token.tokenCreate({
        email: email,
        password: password,
        re_password: password,
      });
      if (res2) {
        window.localStorage.setItem("access", res2.data.access);
        window.localStorage.setItem("refresh", res2.data.refresh);
      }
      if (res && res.error) {
        throw new Error(res.error);
      }
      return res;
    },
    mutationKey: ["signin"],
    onError: async (error) => {
      const err = error as Error;
      if (err instanceof ApiError) {
        const msg = err.body;
        for (const [key, value] of Object.entries(msg)) {
          showErrorToast(`${titleize(key)}: ${value}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return;
      } else {
        showErrorToast(err.message);
      }
    },
    onSuccess: async (res) => {
      showSuccessToast("Account Logged in successfully");
      showWarningToast("Redirecting...");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
  });

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
      <Input
        label="Email"
        placeholder="Enter your email"
        size="lg"
        value={email}
        onValueChange={setEmail}
        isClearable
        isRequired
        variant="bordered"
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        type="password"
        size="lg"
        value={password}
        onValueChange={setPassword}
        isClearable
        isRequired
        variant="bordered"
      />
      <Button
        onClick={() => mutate({ email, password })}
        disabled={isPending || !email || !password}
        size="lg"
        className="w-full"
        color="secondary"
        variant="ghost"
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignIn;
