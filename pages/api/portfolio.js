import fs from "fs";
import { join } from "path";

export default async function handler(req, res) {
  // Prevent caching of API responses
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  const portfolioData = join(process.cwd(), "data/portfolio.json");
  if (req.method === "POST") {
    try {
      fs.writeFileSync(
        portfolioData,
        JSON.stringify(req.body, null, 2),
        "utf-8"
      );
      return res.status(200).json({ status: "DONE" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const file = fs.readFileSync(portfolioData, "utf-8");
      return res.status(200).json(JSON.parse(file));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
