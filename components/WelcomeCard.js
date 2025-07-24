import React, { useState } from "react";

const WelcomeCard = ({ initialTitle = "Welcome!", initialMessage = "Thanks for visiting my portfolio.", onSave, showEdit = true }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);

  const handleSave = () => {
    setEditing(false);
    if (onSave) onSave({ title, message });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-popIn">
        {editing ? (
          <>
            <input
              className="w-full mb-4 p-2 rounded border"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="w-full mb-4 p-2 rounded border"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Message"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleSave}>Save</button>
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2 animate-bounce text-blue-700 dark:text-blue-300">{title}</h2>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-200 animate-fadeInSlow">{message}</p>
            {showEdit && (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
            <button className={`ml-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition ${!showEdit ? '' : ''}`} onClick={() => onSave && onSave({ title, message, close: true })}>
              Continue
            </button>
          </>
        )}
      </div>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.5s; }
        .animate-popIn { animation: popIn 0.4s; }
        .animate-bounce { animation: bounce 1s infinite alternate; }
        .animate-fadeInSlow { animation: fadeIn 1.2s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default WelcomeCard;
