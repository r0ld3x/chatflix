export type getMessages = {
  next: string;
  previous: string;
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: Result[];
};

type Result = {
  id: number;
  sender: Sender;
  content: string;
  created: string;
  likes_count: number;
};

type Sender = {
  username: string;
  full_name: string;
  profile_pic: null;
};
