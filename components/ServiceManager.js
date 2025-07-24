import React, { useState } from 'react';

const ServiceManager = ({ services, setServices, onSave }) => {
  const [newService, setNewService] = useState({ title: '', description: '' });

  const handleAdd = () => {
    if (!newService.title.trim()) return;
    const updated = [
      ...services,
      { ...newService, id: Date.now().toString() },
    ];
    setServices(updated);
    setNewService({ title: '', description: '' });
    onSave(updated);
  };

  const handleDelete = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    onSave(updated);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Manage Services</h2>
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border rounded px-2 py-1"
          placeholder="Service Title"
          value={newService.title}
          onChange={e => setNewService({ ...newService, title: e.target.value })}
        />
        <textarea
          className="border rounded px-2 py-1"
          placeholder="Service Description"
          value={newService.description}
          onChange={e => setNewService({ ...newService, description: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-fit"
          onClick={handleAdd}
        >
          Add Service
        </button>
      </div>
      <ul className="space-y-2">
        {services.map((service) => (
          <li key={service.id} className="flex items-center gap-2">
            <span className="font-semibold">{service.title}</span>
            <button
              className="text-red-600 hover:underline text-sm"
              onClick={() => handleDelete(service.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceManager;
