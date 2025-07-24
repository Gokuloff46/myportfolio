import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { slug, title, date, tagline, preview, image, content } = req.body;
  if (!slug || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const postsDir = path.join(process.cwd(), "_posts");
  const filePath = path.join(postsDir, `${slug}.md`);
  try {
    const mdContent = matter.stringify(content || "", {
      title,
      date: date || new Date().toISOString(),
      tagline: tagline || "",
      preview: preview || "",
      image: image || "",
    });
    fs.writeFileSync(filePath, mdContent, "utf-8");
    res.status(200).json({ status: "CREATED" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
