import { Divider, Link } from "@nextui-org/react";
import SignUp from "./SignUp";

const Page = () => {
  return (
    <main className="bg-[url('https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=billy-huynh-W8KTS-mhFUE-unsplash.jpg')] h-screen bg-cover bg-center bg-no-repeat text-white">
      <div className="container h-full flex items-center justify-center ">
        <div className="  bg-zinc-800 p-4 rounded-md text-start outline-primary-500  shadow-lg shadow-primary-300 outline-double outline-2">
          <h1 className="font-poppins text-2xl tracking-wider font-bold  ">
            Signup
          </h1>
          <Divider className="my-4" />
          <SignUp />
          <Divider className="my-4" />
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-tiny tracking-wide">
              Already have an account?
            </h3>
            <Link href="/login" color="primary" showAnchorIcon size="sm">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
