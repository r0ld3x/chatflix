import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import {
  Button,
  Chip,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { showErrorToast, showWarningToast } from "../ShowToast";

const CreateInviteLink = ({
  isOpen,
  onOpenChange,
  username,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  username: string;
}) => {
  const [link, setLink] = useState("");

  const { isPending, isSuccess, mutate, reset } = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      const session = getAccessToken();
      const api = getApiClient(session);
      const res = await api.room.createInviteLink({
        username,
      });
      if (!res) {
        return res;
      }
      return res;
    },
    mutationKey: ["generate-link-room"],
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
    onSuccess: async ({ data: { identifier } }) => {
      setLink(identifier);
      showWarningToast("Invite link generated successfully.");
    },
  });

  useEffect(() => {
    return () => {
      setLink("");
      reset();
    };
  }, [onOpenChange]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-poppins tracking-wide">
              <h2>Create A Invite Link</h2>
            </ModalHeader>
            <Divider className="" />
            <ModalBody className="flex items-center ">
              {link ? (
                <Chip
                  endContent={
                    <CopyIcon
                      className="ml-2 cursor-pointer"
                      size={18}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/join_room/${link}`
                        );
                        showWarningToast("Link copied to clipboard.");
                      }}
                    />
                  }
                  variant="bordered"
                  className="w-full py-5 px-4"
                >
                  <Link
                    href={`/join_room/${link}`}
                  >{`${window.location.origin}/join_room/${link}`}</Link>
                </Chip>
              ) : (
                <p className="self-start">
                  Click on <b>Generate</b> button to generate a link
                </p>
              )}
            </ModalBody>
            <Divider className="" />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                variant="ghost"
                isLoading={isPending}
                isDisabled={isSuccess}
                onPress={() => {
                  mutate({
                    username,
                  });
                }}
              >
                Generate
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateInviteLink;
