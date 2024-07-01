"use client";

import { showErrorToast, showWarningToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isPending, isSuccess, mutate, mutateAsync } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const api = await getApiClient();
      const res = await api.user.usersCreate({ email, password });
      return res.data;
    },
    mutationKey: ["signup"],
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
      showWarningToast("Check your mail to verify your account");
      setTimeout(() => {
        window.location.href = "/login";
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
        onClick={() =>
          mutate({
            email,
            password,
          })
        }
        size="lg"
        className="w-full"
        color={isSuccess ? "success" : "primary"}
        variant="ghost"
        isLoading={isPending}
        isDisabled={
          isPending ||
          isSuccess ||
          !email ||
          email.length < 1 ||
          !password ||
          password.length < 1
        }
      >
        {isSuccess ? "Redirecting..." : isPending ? "Signing Up..." : "Sign Up"}
      </Button>
    </div>
  );
};

export default SignUp;
