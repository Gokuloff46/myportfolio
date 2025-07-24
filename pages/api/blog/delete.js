import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }
  const postsDir = path.join(process.cwd(), "_posts");
  const filePath = path.join(postsDir, `${slug}.md`);
  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ status: "DELETED" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
