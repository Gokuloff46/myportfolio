import React, { useState } from "react";
import Button from "../../components/Button";
import DatePicker from "react-datepicker";
import TextareaAutosize from "react-textarea-autosize";
import { useTheme } from "next-themes";

import "react-datepicker/dist/react-datepicker.css";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const BlogEditor = ({ post, close, refresh }) => {
  const { theme } = useTheme();
  const isNew = !post;
  const [currentTabs, setCurrentTabs] = useState("BLOGDETAILS");
  const [blogContent, setBlogContent] = useState(post ? post.content : "");
  const [blogVariables, setBlogVariables] = useState({
    date: post ? post.date : new Date().toISOString(),
    title: post ? post.title : "",
    tagline: post ? post.tagline : "",
    preview: post ? post.preview : "",
    image: post ? post.image : "",
  });
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const savePost = async () => {
    setSaveError("");
    setSaveSuccess("");
    if (isNew) {
      // Create new blog
      const slug = slugify(blogVariables.title);
      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: blogVariables.title,
          date: blogVariables.date,
          tagline: blogVariables.tagline,
          preview: blogVariables.preview,
          image: blogVariables.image,
          content: blogContent,
        }),
      });
      if (res.ok) {
        setSaveSuccess("Blog created successfully!");
        setTimeout(() => {
          close();
          refresh();
        }, 800);
      } else {
        const err = await res.json();
        setSaveError("Failed to create: " + (err.error || res.status));
      }
    } else {
      // Edit existing blog
      await fetch("/api/blog/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: post.slug,
          content: blogContent,
          variables: blogVariables,
        }),
      })
        .then((data) => {
          if (data.status === 200) {
            setSaveSuccess("Blog saved successfully!");
            setTimeout(() => {
              close();
              refresh();
            }, 800);
          } else {
            data.json().then((err) => {
              setSaveError("Failed to save: " + (err.error || data.status));
            });
          }
        })
        .catch((err) => {
          setSaveError("Network or server error: " + err.message);
        });
    }
  };

  return (
    <div
      className={`fixed z-10 w-screen h-screen overflow-auto top-0 flex flex-col items-center ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="container my-20">
        <div className="mt-10">
          <div className="z-10 sticky top-12">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl">
                {blogVariables.title || (isNew ? "New Blog" : "")}
              </h1>
              <div className="flex items-center">
                <Button onClick={savePost} type="primary">
                  Save
                </Button>
                <Button onClick={close}>Close</Button>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                onClick={() => setCurrentTabs("BLOGDETAILS")}
                type={currentTabs === "BLOGDETAILS" && "primary"}
              >
                Blog Details
              </Button>
              <Button
                onClick={() => setCurrentTabs("CONTENT")}
                type={currentTabs === "CONTENT" && "primary"}
              >
                Content
              </Button>
            </div>
          </div>
        </div>
        {saveError && <div style={{ color: "red", margin: 8 }}>{saveError}</div>}
        {saveSuccess && (
          <div style={{ color: "green", margin: 8 }}>{saveSuccess}</div>
        )}
        {currentTabs === "BLOGDETAILS" && (
          <div className="mt-10">
            <div className="mt-5 flex flex-col items-center">
              <label className="w-full text-sx opacity-50">Date</label>
              <DatePicker
                selected={new Date(blogVariables.date)}
                className="w-full mt-2 p-4 hover:border-blue-400 rounded-md shadow-lg border-2"
                onChange={(date) => {
                  setBlogVariables({
                    ...blogVariables,
                    date: date.toISOString(),
                  });
                }}
              />
            </div>
            <div className="mt-5 flex flex-col items-center">
              <label className="w-full text-sx opacity-50">Title</label>
              <input
                value={blogVariables.title}
                onChange={(e) =>
                  setBlogVariables({ ...blogVariables, title: e.target.value })
                }
                className="w-full mt-2 p-4 hover:border-blue-400 rounded-md shadow-lg border-2"
                type="text"
              ></input>
            </div>

            <div className="mt-5 flex flex-col items-center">
              <label className="w-full text-sx opacity-50">Tagline</label>
              <input
                value={blogVariables.tagline}
                onChange={(e) =>
                  setBlogVariables({
                    ...blogVariables,
                    tagline: e.target.value,
                  })
                }
                className="w-full mt-2 p-4 hover:border-blue-400 rounded-md shadow-lg border-2"
                type="text"
              ></input>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <label className="w-full text-sx opacity-50">preview (SEO)</label>
              <textarea
                value={blogVariables.preview}
                onChange={(e) =>
                  setBlogVariables({
                    ...blogVariables,
                    preview: e.target.value,
                  })
                }
                className="w-full mt-2 p-4 hover:border-blue-400 rounded-md shadow-lg border-2"
                type="text"
              ></textarea>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <label className="w-full text-sx opacity-50">Image</label>
              <input
                value={blogVariables.image}
                onChange={(e) =>
                  setBlogVariables({
                    ...blogVariables,
                    image: e.target.value,
                  })
                }
                className="w-full mt-2 p-4 hover:border-blue-400 rounded-md shadow-lg border-2"
                type="text"
              ></input>
            </div>
          </div>
        )}

        {currentTabs === "CONTENT" && (
          <div className="mt-10">
            <div className="flex flex-col items-center">
              <label className="w-full text-sx opacity-50">Content</label>
              <TextareaAutosize
                className="w-full h-auto mt-5 p-4 border hover:border-blue-400 rounded-xl shadow-xl"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
              ></TextareaAutosize>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
