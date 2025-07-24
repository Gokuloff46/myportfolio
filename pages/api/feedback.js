import nodemailer from 'nodemailer';

// Simple in-memory rate limit (per IP)
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { name, designation, email, message, honey, captcha, captchaAnswer } = req.body;
  if (!message || !name) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }
  // Honeypot check
  if (honey) {
    return res.status(400).json({ error: 'Spam detected.' });
  }
  // Simple math captcha check
  if (!captcha || !captchaAnswer || String(Number(captcha) + 4) !== String(captchaAnswer)) {
    return res.status(400).json({ error: 'Captcha failed.' });
  }
  // Rate limit by IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < RATE_LIMIT_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }
  rateLimit[ip] = now;

  const toEmail = process.env.FEEDBACK_EMAIL || 'k.gokul.raj.official@gmail.com';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Build the email body
  const mailText = `Name: ${name}\nDesignation: ${designation || "-"}\nEmail: ${email || "-"}\n\nMessage:\n${message}`;

  try {
    await transporter.sendMail({
      from: email || 'portfolio-feedback@no-reply.com',
      to: toEmail,
      subject: 'Portfolio Feedback',
      text: mailText,
    });
    res.status(200).json({ status: 'Feedback sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
