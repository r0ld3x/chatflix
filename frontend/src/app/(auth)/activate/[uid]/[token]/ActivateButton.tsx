"use client";
import { showErrorToast, showSuccessToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

const ActivateButton = ({ uid, token }: { uid: string; token: string }) => {
  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async ({ uid, token }: { uid: string; token: string }) => {
      const api = await getApiClient();
      const res = await api.user.usersActivate({ uid, token });
      return res.data;
    },
    mutationKey: ["activate"],
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
      showSuccessToast("Account activated successfully. Please login now!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    },
  });
  return (
    <Button
      color="primary"
      className="w-full mt-3"
      variant="ghost"
      onClick={() => mutate({ uid, token })}
      aria-label="Activate Button"
      isLoading={isPending}
    >
      {isSuccess
        ? "Redirecting..."
        : isPending
        ? "Activating Account..."
        : "Activate"}
    </Button>
  );
};

export default ActivateButton;
