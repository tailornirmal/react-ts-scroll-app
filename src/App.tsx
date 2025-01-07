import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Post from "./Post";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function App() {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollPosition,setScrollPosition] = useState<number>(0);

  const fetchPosts = useCallback(async () => {
    console.log("fetching posts");
    const response = await fetch(
      `https://dummyjson.com/posts?limit=${page * 10}`
    );
    const data = await response.json();
    console.log("dd", data);
    setPosts(data.posts);
    window.scrollTo(0, scrollPosition);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  function debounce(func: Function, wait: number) {
    let timeout: number;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }

  const handleScroll = (event: Event) => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setLoading(true);
      setScrollPosition((event?.target as HTMLElement).scrollTop);
    }
  };

  useEffect(() => {
    if (loading) {
      setPage(page + 1);
    }
  }, [loading]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 500);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  console.log("hello", posts);
  console.log("page", page);
  console.log("scrollposition", scrollPosition);

  return (
    <div>
      {
        loading ? (
          <div className="container">
            <div className="spinner-frame">
              <div className="spinner-cover"></div>
              <div className="spinner-bar"></div>
            </div>
          </div>
        )
        :
        <div>
          <h1>Posts</h1>
          {
            posts.map((post) => {
              return <Post key={post.id} post={post} />;
            })
          }
        </div>
      }
      
    </div>
  );
}

export default App;
