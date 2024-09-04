import { RetrieveUserResponse } from "@/types/api/models/UserServiceTypes";
import { Link, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import NavBarProfile from "./NavBarProfile";

const NavBar = ({ user }: { user: RetrieveUserResponse }) => {
  return (
    <Navbar isBordered className="flex-shrink-0  border-b-1 border-white">
      <NavbarBrand>
        <Link className="font-bold text-inherit" href="/">
          CHATFLIX
        </Link>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavBarProfile user={user} />
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
