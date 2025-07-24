import React, { useState } from "react";

const FeedbackForm = ({ toEmail }) => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(() => String(Math.floor(Math.random() * 10) + 1));
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honey, setHoney] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, designation, email, message, honey, captcha, captchaAnswer }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Thank you for your feedback!");
      setName("");
      setDesignation("");
      setMessage("");
      setEmail("");
      setCaptcha(String(Math.floor(Math.random() * 10) + 1));
      setCaptchaAnswer("");
    } else {
      setStatus(data.error || "Failed to send feedback.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-slate-800 rounded-xl shadow-lg max-w-xl w-full">
      <h2 className="text-2xl font-bold mb-2 text-center">Send Feedback</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Honeypot field (hidden from users) */}
        <input
          type="text"
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
          value={honey}
          onChange={e => setHoney(e.target.value)}
          name="honey"
        />
        <input
          type="text"
          className="p-2 rounded border"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="p-2 rounded border"
          placeholder="Your designation (optional)"
          value={designation}
          onChange={e => setDesignation(e.target.value)}
        />
        <input
          type="email"
          className="p-2 rounded border"
          placeholder="Your email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <textarea
          className="p-2 rounded border min-h-[80px]"
          placeholder="Your feedback..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <div className="flex items-center gap-2">
          <label htmlFor="captcha" className="text-sm">What is {captcha} + 4?</label>
          <input
            id="captcha"
            type="number"
            className="p-2 rounded border w-20"
            value={captchaAnswer}
            onChange={e => setCaptchaAnswer(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading || !message}
        >
          {loading ? "Sending..." : "Send Feedback"}
        </button>
        {status && <div className="text-center text-green-600 dark:text-green-400 mt-2">{status}</div>}
      </form>
    </div>
  );
};

export default FeedbackForm;
