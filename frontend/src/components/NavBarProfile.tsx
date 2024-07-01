"use client";

import { RetrieveUserResponse } from "@/types/api/models/UserServiceTypes";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { DoorOpen, Home, User2Icon } from "lucide-react";
import CreateRoomDialog from "./Dialogs/CreateRoomDialog";

const NavBarProfile = ({
  user: { email, id, image, username, name },
}: {
  user: RetrieveUserResponse;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <CreateRoomDialog isOpen={isOpen} onOpenChange={onOpenChange} />
      <Dropdown>
        <DropdownTrigger className="">
          <Button className="min-w-fit   bg-none p-0 h-fit w-fit rounded-full overflow-hidden">
            <Avatar
              isBordered
              className="transition-transform"
              color="primary"
              src={image || `https://api.dicebear.com/8.x/pixel-art/png`}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="shadow"
          disabledKeys={["profile"]}
          color="primary"
        >
          <DropdownItem
            key="info"
            className="h-14 cursor-default pointer-events-none space-y-3"
          >
            <p className="font-semibold font-poppins">Signed in as</p>
            <Chip variant="bordered" color="success" className="">
              {email}
            </Chip>
          </DropdownItem>
          <DropdownItem
            key="profile"
            href="/profile"
            startContent={<User2Icon />}
          >
            Profile
          </DropdownItem>
          <DropdownItem key="create-room" onClick={onOpen}>
            <h3 className="flex gap-2 items-center justify-start">
              <span>
                <Home className="h-4 w-4" />
              </span>
              Create Room
            </h3>
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<DoorOpen />}
            onClick={() => {
              document.cookie.split(";").forEach(function (c) {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/"
                  );
              });
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default NavBarProfile;
