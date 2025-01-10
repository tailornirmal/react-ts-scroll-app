import React from "react";

interface PostProps {
  post: {
    readonly id: number;
    readonly title: string;
    readonly body: string;
    readonly reactions: {
      likes: number;
      dislikes: number;
    };
    readonly views: number;
  };
}


const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div key={post.id}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <span className="after-content">Views : {post.views}</span>
      <span className="after-content">likes : {post.reactions.likes}</span>
      <span className="after-content">Dislikes : {post.reactions.dislikes}</span>
    </div>
  );
};

export default Post;
