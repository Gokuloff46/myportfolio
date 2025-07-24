import React from 'react';

const FreelanceCard = ({ gig }) => {
  if (!gig) return null;

  return (
    <div className="p-4 border rounded mb-4 shadow">
      <h2 className="text-xl font-bold">{gig.title}</h2>
      <p className="text-gray-600">{gig.client}</p>
      <p className="mt-2">{gig.description}</p>
      {gig.link && (
        <a href={gig.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">View Project</a>
      )}
      <div className="text-xs text-gray-400 mt-2">{gig.date}</div>
    </div>
  );
};

export default FreelanceCard;
