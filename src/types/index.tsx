export interface PostProps {
  id: number;
  title: string;
  body: string;
  reactions: object;
  views: number
}

export interface ErrorProps  {
  type: string;
  message: string;
}