export type getRoomInformation = {
  name: string;
  creator: RoomCreator;
  total_users: number;
  created_at: string;
  updated_at: string;
  bio: string | null;
  username: string;
  profile_pic: string | null;
};

export type RoomCreator = {
  username: string;
  full_name: string;
  profile_pic: string | null;
};
