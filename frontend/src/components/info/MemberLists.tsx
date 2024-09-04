import { getApiClient } from "@/lib/api";
import { getAccessToken } from "@/lib/helper";
import { getRoomInformation, User } from "@/types/api/models/RoomTypes";

import { Avatar, Button, cn, Divider, Link } from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { showWarningToast } from "../ShowToast";

const MemberLists = ({ data }: { data: getRoomInformation }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [hide, setHide] = useState(false);

  const {
    status,
    data: queryData,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getMembers"],
    queryFn: async ({ pageParam }) => {
      const session = getAccessToken();
      const api = await getApiClient(session);
      const res = await api.room.getMembers({
        username: data.username,
        pageParam,
        page_size: 10,
      });
      if (!res) {
        showWarningToast("Old Messages Failed to Load");
        return null;
      }
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.current_page < lastPage.total_pages
        ? lastPage?.current_page + 1
        : undefined;
    },
    enabled: enabled,
  });

  useEffect(() => {
    if (!queryData) return;
    const data = queryData.pages;
    const allResults = data.flatMap((page) => (page ? page.results : []));
    setMembers(allResults ? allResults : []);
  }, [queryData]);

  const handleFetchData = () => {
    setEnabled(true);
    fetchNextPage();
  };

  return (
    <div
      className={cn("bg-content1 flex-1 flex flex-col ", {
        "h-0": hide,
        "h-full": !hide,
      })}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer "
        onClick={() => (enabled ? setHide((isHidden) => !isHidden) : undefined)}
      >
        <h1 className="">Members</h1>
      </div>
      <Divider />
      <div className="overflow-y-scroll">
        {isFetching && <div>Loading...</div>}
        {status === "error" && <div>Error: {error.message}</div>}
        {members.length !== 0 ? (
          <div className="">
            {members.map((user) => (
              <>
                <div key={user.username} className="container my-2">
                  <Link
                    href={`/user/${user.username}`}
                    className="flex items-center p-3 gap-3 "
                    color={"foreground"}
                  >
                    <Avatar
                      alt={user.full_name || user.username}
                      className="flex-shrink-0 pointer-events-none"
                      src={user.profile_pic ?? ""}
                      isBordered
                      color="primary"
                      showFallback
                    />
                    <div className="flex flex-col items-start justify-center ml-2">
                      <h1 className="font-poppins tracking-wider text-sm">
                        {user.full_name || user.username}
                      </h1>
                    </div>
                  </Link>
                </div>
                <Divider />
              </>
            ))}
            {hasNextPage && (
              <>
                <Divider className="my-2" />
                <div className="container">
                  <Button
                    className="text-center p-4 flex items-center justify-center  "
                    fullWidth
                    color="primary"
                    variant="ghost"
                    onPress={handleFetchData}
                  >
                    Load more members
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="container">
            <Button
              className="text-center p-4 flex items-center justify-center "
              fullWidth
              color="primary"
              variant="ghost"
              onPress={handleFetchData}
            >
              get members
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberLists;
