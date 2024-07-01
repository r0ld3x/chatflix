import { getApiClient } from "@/lib/api";
import { getAccessToken, titleize } from "@/lib/helper";
import { ApiError } from "@/types/api";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { BookA, University } from "lucide-react";
import { useState } from "react";
import { showErrorToast, showWarningToast } from "../ShowToast";

const CreateRoomDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<File | undefined>(undefined);
  const [ppUrl, setPpUrl] = useState("");

  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async ({
      name,
      username,
      profilePic,
    }: {
      name: string;
      username: string;
      profilePic?: File;
    }) => {
      const session = getAccessToken();
      const api = getApiClient(session);
      const res = await api.room.create({ name, username, profilePic });
      if (!res) {
        throw Error(res);
      }
      return res;
    },
    mutationKey: ["create-room"],
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
    onSuccess: async () => {
      showWarningToast("Room created successfully.");
      onOpenChange(false);
    },
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setPpUrl(URL.createObjectURL(file));
    setProfilePic(file);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-poppins tracking-wide">
                <>
                  <h2>Create Your Own Chat Room</h2>
                </>
              </ModalHeader>
              <Divider className="" />
              <ModalBody>
                <div className="flex items-center justify-center  w-full">
                  <div className="w-24 h-24 cursor-pointer">
                    <input
                      type="file"
                      className="absolute w-24 h-24  opacity-0 z-10 cursor-pointer "
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png"
                    />
                    <Avatar
                      classNames={{
                        base: "w-24 h-24 cursor-pointer",
                      }}
                      src={ppUrl.length > 0 ? ppUrl : undefined}
                      isBordered
                      color="primary"
                      name={(name.length > 0 && name) || ""}
                    />
                  </div>
                </div>
                <Input
                  variant="bordered"
                  classNames={{
                    base: "max-w-full sm:max-w-[10rem] h-10   ",
                    mainWrapper: "h-full   ",
                    input: "text-small   ",
                    inputWrapper: "h-full   font-normal  outline-primary-500 ",
                  }}
                  color="primary"
                  className=" min-w-full "
                  placeholder="Enter the name"
                  onValueChange={setName}
                  value={name}
                  startContent={<BookA size={18} />}
                  isClearable
                  type="text"
                />
                <Input
                  variant="bordered"
                  classNames={{
                    base: "max-w-full sm:max-w-[10rem] h-10   ",
                    mainWrapper: "h-full   ",
                    input: "text-small   ",
                    inputWrapper: "h-full   font-normal  outline-primary-500 ",
                  }}
                  color="primary"
                  className=" min-w-full "
                  placeholder="Enter the Username"
                  onValueChange={setUsername}
                  value={username}
                  startContent={<University size={18} />}
                  isClearable
                  type="text"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  variant="ghost"
                  isLoading={isPending}
                  isDisabled={username.length < 1 || name.length < 1}
                  onPress={() => {
                    mutate({
                      name,
                      username,
                      profilePic,
                    });
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRoomDialog;
