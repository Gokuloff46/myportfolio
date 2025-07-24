import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, content, variables } = req.body;
  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  const postsDir = path.join(process.cwd(), "_posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  try {
    // Prepare new markdown content
    const newContent = matter.stringify(content, variables);
    fs.writeFileSync(filePath, newContent, "utf-8");
    return res.status(200).json({ status: "DONE" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
