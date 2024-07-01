"use client";

import { UserActivateDataResponse } from "@/types/api/models/UserCreate";
import { Input } from "@nextui-org/react";
import { useState } from "react";

const FillUpForm = ({
  data: { email, id, image, is_active, name, username: userName },
}: {
  data: UserActivateDataResponse;
}) => {
  const [username, setUsername] = useState(userName);
  return (
    <div>
      <Input
        value={email}
        disabled
        disableAnimation
        readOnly
        isReadOnly
        variant="flat"
        color="primary"
      />
      <div className="flex py-4 items-center justify-between gap-4">
        <Input
          label="Username"
          placeholder="Enter your username"
          type="username"
          size="lg"
          value={username}
          onValueChange={setUsername}
          isClearable
          isRequired
          variant="bordered"
        />
        <Input
          label="Username"
          placeholder="Enter your username"
          type="username"
          size="lg"
          value={username}
          onValueChange={setUsername}
          isClearable
          isRequired
          variant="bordered"
        />
        <Input
          label="Username"
          placeholder="Enter your username"
          type="username"
          size="lg"
          value={username}
          onValueChange={setUsername}
          isClearable
          isRequired
          variant="bordered"
        />
      </div>
    </div>
  );
};

export default FillUpForm;
