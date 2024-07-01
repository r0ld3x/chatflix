import { Spinner } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner label="Loading..." color="primary" />
    </div>
  );
};

export default Loading;
