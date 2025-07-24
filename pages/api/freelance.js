import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      // Filter out invalid gigs
      const validFreelance = Array.isArray(data.freelance)
        ? data.freelance.filter(gig => gig && typeof gig === 'object' && gig.title)
        : [];
      res.status(200).json({ freelance: validFreelance });
    } catch (err) {
      res.status(500).json({ error: 'Failed to read freelance data.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { freelance } = req.body;
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      data.freelance = freelance;
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
      res.status(200).json({ status: 'DONE' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save freelance data.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
