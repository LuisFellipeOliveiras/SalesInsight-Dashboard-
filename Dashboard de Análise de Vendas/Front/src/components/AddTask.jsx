import React, { useState } from 'react';

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');
    onAdd(title, desc);
    setTitle('');
    setDesc('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ padding: 8, width: '60%', marginRight: 10 }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        style={{ padding: 8, width: '30%' }}
      />
      <button type="submit" style={{ padding: '8px 16px', marginLeft: 10 }}>
        Add
      </button>
    </form>
  );
}
