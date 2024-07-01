import CreateJoinLink from "@/components/Dialogs/CreateJoinLink";
import { getRoomInformation } from "@/types/api/models/RoomTypes";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { EllipsisVertical } from "lucide-react";

const MessageHeader = ({ data }: { data: getRoomInformation }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <CreateJoinLink
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        username={data.username}
      />
      <div className="container flex justify-between items-center py-2">
        <div className="flex  gap-3 items-center justify-center">
          <Avatar
            src={
              data.profile_pic || `https://api.dicebear.com/8.x/pixel-art/png`
            }
          />
          <div className="flex  flex-col items-start justify-center">
            <h1 className="text-2xl text-pretty font-poppins tracking-wide font-bold">
              {data.name}
            </h1>
            <h3 className="text-[0.8rem] text-slate-400">
              {data.total_users} members
            </h3>
          </div>
        </div>
        <div className="">
          <Dropdown>
            <DropdownTrigger>
              <button className="outline-none focus:outline-none">
                <EllipsisVertical className="cursor-pointer" />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              disabledKeys={["edit", "delete"]}
            >
              <DropdownItem key="new" onClick={onOpen}>
                Get Invite Link
              </DropdownItem>
              <DropdownItem key="edit">Edit Room</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete Room
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default MessageHeader;
