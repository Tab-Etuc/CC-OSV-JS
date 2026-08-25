export interface Data2 {
  subreddit: string;
  selftext: string;
  title: string;
  author: string;
  permalink: string;
  author_flair_text_color: string;
  url: string;
  over_18: boolean;
  created_utc: number;
  is_video: boolean;
  thumbnail: string;
}

interface Child {
  data: Data2;
}

interface Data {
  children: Child[];
}

export interface RootObject {
  data: Data;
}
