import { getAdminPassword } from '../../utils/secure';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { username, password } = req.body;
  // Only check password on the server side
  if (username === 'admin' && password === getAdminPassword()) {
    return res.status(200).json({ status: 'ok' });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
