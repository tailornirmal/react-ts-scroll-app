import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Post from "./Post";

import { PostProps } from "./types/index";

function App() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>(null);

  const fetchPosts = useCallback(async () => {
    console.log("fetching posts");
    try {
      const response = await fetch(
        `https://dummyjson.com/posts?limit=${page * 6}`
      );
      const data = await response.json();
      const posts = data.posts.map((post: PostProps) => ({ id: post.id, title: post.title, body: post.body, reactions: post.reactions, views: post.views }));
      console.log("posts", posts);
      setPosts(posts);
    } catch (error) {
      console.log("error", error);
      if (error instanceof Error) {
        setError({ type: "fetch", message: error.message });
      } else {
        setError({ type: "fetch", message: "An unknown error occurred" });
      }
    }
    finally {
      setLoading(false);
    }
    
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  
  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (loading) {
      setPage(page + 1);
    }
  }, [loading]);

  useEffect(() => {
    const debouncedHandleScroll = handleScroll;
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  console.log("hello", posts);
  console.log("error", error);

  if(error) {
    return <div>{(error as Error).message}</div>
  }

  return (
    <>
        <h1>Posts</h1>
        <div>
          {
            posts.map((post) =>  <Post key={post.id} post={post} />)
          }
        </div>
        {loading && <div className="loading"></div>}      
    </>
  );
}

export default App;
