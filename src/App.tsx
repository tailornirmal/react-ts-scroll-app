import "./App.css";
import { useEffect, useState, useCallback, useRef } from "react";
import Post from "./Post";
import Layout from "./Layout";

import { PostProps } from "./types/index";
import { Constants } from "./constants";

function App() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>(null);

  const scrollposition = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async () => {
    console.log("fetching posts");
    try {
      const response = await fetch(
        `${Constants.fetchPostsBaseUrl}?limit=${page * 6}`
      );
      const data = await response.json();
      const posts = data.posts.map((post: PostProps) => ({ id: post.id, title: post.title, body: post.body, reactions: post.reactions, views: post.views }));
      console.log("posts", posts);
      setPosts(posts);
      scrollposition.current?.scrollIntoView({ behavior: "smooth" });
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
      document.body.scrollHeight - 30 <
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

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if(value === "reactions") {
      setPosts([...posts].sort((a, b) => b.views - a.views));
    } else if(value === "likes") {
      setPosts([...posts].sort((a, b) => b.reactions.likes - a.reactions.likes));
    } else if(value === "dislikes") {
      setPosts([...posts].sort((a, b) => b.reactions.dislikes - a.reactions.dislikes));
    }
    scrollposition.current?.scrollIntoView({ behavior: "smooth" });
  }


  console.log("hello", posts);
  console.log("error", error);


  if(error) {
    return <div>{(error as Error).message}</div>
  }

  return (
    <>
      <Layout>
        <div>
            <select name="sort" id="sort" onChange={(event) => handleSort(event)}>
              <option value="">Sort</option>
              <option value="reactions">Views</option>
              <option value="likes">Likes</option>
              <option value="dislikes">Dislikes</option>
            </select>
          </div>
          <div>
            <h1>Posts</h1>
            <span>Total Posts: {posts.length > 0 ? posts.length : 'counting...'}</span>
            <span style={{ marginLeft: '10px' }}>Page: {page}</span>
          </div>
          
      </Layout>
        <div style={{ marginTop: "10rem", padding: "1rem" }}>
          {
            posts.map((post) =>  <Post key={post.id} post={post} />)
          }
        </div>
        {loading && <div ref={scrollposition} className="loading"></div>}      
    </>
  );
}

export default App;
