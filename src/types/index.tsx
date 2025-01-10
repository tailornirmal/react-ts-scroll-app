export interface PostProps {
  id: number;
  title: string;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number
}

export interface ErrorProps  {
  type: string;
  message: string;
}