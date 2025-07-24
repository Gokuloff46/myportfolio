import React, { useEffect, useState } from "react";
import Button from "../Button";
import BlogEditor from "./index";

export default function BlogPostManager() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");

  useEffect(() => {
    fetch("/api/blog/list")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, [refreshFlag]);

  const handleDelete = async (slug) => {
    setDeleteStatus("");
    const res = await fetch("/api/blog/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setDeleteStatus("Deleted successfully!");
      setRefreshFlag((f) => !f);
    } else {
      setDeleteStatus("Failed to delete.");
    }
  };

  if (selectedPost) {
    return (
      <BlogEditor
        post={selectedPost}
        close={() => setSelectedPost(null)}
        refresh={() => setRefreshFlag((f) => !f)}
      />
    );
  }

  if (addMode) {
    return (
      <BlogEditor
        post={null}
        close={() => setAddMode(false)}
        refresh={() => setRefreshFlag((f) => !f)}
      />
    );
  }

  return (
    <div>
      <h3 className="text-xl mb-2">Your Blog Posts</h3>
      <Button
        onClick={() => setAddMode(true)}
        type="primary"
        className="mb-4"
      >
        Add New Blog
      </Button>
      {deleteStatus && <div className="text-sm mb-2">{deleteStatus}</div>}
      {posts.length === 0 && <div>No blog posts found.</div>}
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2 flex items-center">
            <span className="mr-4">{post.title}</span>
            <Button
              onClick={() => setSelectedPost(post)}
              type="primary"
              className="mr-2"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(post.slug)}
              type="danger"
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
