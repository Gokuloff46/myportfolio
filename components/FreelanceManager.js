import React, { useState } from 'react';
import Button from './Button';
import { v4 as uuidv4 } from 'uuid';

const FreelanceManager = ({ freelance, setFreelance }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', client: '', description: '', link: '', date: '' });

  const handleEdit = (gig) => {
    setEditing(gig.id);
    setForm(gig);
  };

  const handleSave = () => {
    if (editing) {
      setFreelance(freelance.map(g => g.id === editing ? { ...form, id: editing } : g));
    } else {
      setFreelance([...freelance, { ...form, id: uuidv4() }]);
    }
    setEditing(null);
    setForm({ title: '', client: '', description: '', link: '', date: '' });
  };

  const handleDelete = (id) => {
    setFreelance(freelance.filter(g => g.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Freelance Gigs</h2>
      {freelance.map(gig => (
        <div key={gig.id} className="mb-4 p-4 border rounded">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{gig.title}</div>
              <div className="text-sm text-gray-500">{gig.client}</div>
              <div>{gig.description}</div>
              {gig.link && <a href={gig.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Link</a>}
              <div className="text-xs text-gray-400">{gig.date}</div>
            </div>
            <div>
              <Button onClick={() => handleEdit(gig)} type="primary">Edit</Button>
              <Button onClick={() => handleDelete(gig.id)} classes="ml-2 bg-red-500 text-white">Delete</Button>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit Gig' : 'Add New Gig'}</h3>
        <input className="block w-full mb-2 p-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="block w-full mb-2 p-2 border rounded" placeholder="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
        <textarea className="block w-full mb-2 p-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="block w-full mb-2 p-2 border rounded" placeholder="Link (optional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
        <input className="block w-full mb-2 p-2 border rounded" placeholder="Date (e.g. 2024)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <Button onClick={handleSave} type="primary">{editing ? 'Save Changes' : 'Add Gig'}</Button>
        {editing && <Button onClick={() => { setEditing(null); setForm({ title: '', client: '', description: '', link: '', date: '' }); }} classes="ml-2">Cancel</Button>}
      </div>
    </div>
  );
};

export default FreelanceManager;
