import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onUpdateTime, onDelete }) {
  if (!tasks.length) return <p>No tasks yet</p>;
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTime={onUpdateTime}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
