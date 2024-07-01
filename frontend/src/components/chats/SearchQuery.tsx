import { Input, Spinner } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

const SearchQuery = () => {
  const { isQueryLoading, setQuery } = useContext(ChatContext);

  return (
    <div>
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
        placeholder="Type to search..."
        size="sm"
        startContent={<SearchIcon size={18} />}
        onValueChange={setQuery}
        endContent={isQueryLoading && <Spinner size="sm" color="primary" />}
        type="search"
        isDisabled
      />
    </div>
  );
};

export default SearchQuery;
