import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const postsDir = path.join(process.cwd(), "_posts");
  try {
    const files = fs.readdirSync(postsDir);
    const posts = files.map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(postsDir, file);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContents);
      return {
        slug,
        ...data,
        content,
      };
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
