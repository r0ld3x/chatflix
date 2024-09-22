"use client";
import { showErrorToast, showWarningToast } from "@/components/ShowToast";
import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

const JoinButton = ({ unique_identifier }: { unique_identifier: string }) => {
  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async ({
      unique_identifier,
    }: {
      unique_identifier: string;
    }) => {
      const session = getAccessToken();
      const api = await getApiClient(session);
      const res = await api.room.join({ unique_identifier });
      return res.data;
    },
    mutationKey: ["join-room"],
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
      showWarningToast("Joined successfully. Redirecting...");
      setTimeout(() => {
        window.location.href = "/chat/" + res.username;
      }, 2000);
    },
  });

  return (
    <Button
      color="primary"
      className="w-full mt-3"
      variant="ghost"
      onClick={() => mutate({ unique_identifier })}
      aria-label="Join Button"
      isLoading={isPending}
    >
      {isSuccess ? "Redirecting..." : isPending ? "Joining Account..." : "Join"}
    </Button>
  );
};

export default JoinButton;
