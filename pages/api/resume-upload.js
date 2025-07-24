import fs from "fs";
import { join } from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const resumePath = join(process.cwd(), "public/resume.pdf");
  if (req.method === "POST") {
    try {
      // Remove old resume if exists
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
      // Save new resume
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(resumePath, buffer);
      return res.status(200).json({ status: "DONE" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
        return res.status(200).json({ status: "DELETED" });
      } else {
        return res.status(404).json({ error: "Resume not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
