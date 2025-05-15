import React, { useState } from 'react';

function secondsToHMS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function TaskItem({ task, onUpdateTime, onDelete }) {
  const [timer, setTimer] = useState(null);
  const [timeCount, setTimeCount] = useState(0);

  const startTimer = () => {
    if (timer) return;
    const interval = setInterval(() => {
      setTimeCount(t => t + 1);
    }, 1000);
    setTimer(interval);
  };

  const stopTimer = async () => {
    if (!timer) return;
    clearInterval(timer);
    setTimer(null);
    await onUpdateTime(task.id, timeCount);
    setTimeCount(0);
  };

  return (
    <li
      style={{
        marginBottom: 12,
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <small>Time spent: {secondsToHMS(task.time_spent + timeCount)}</small>
      </div>
      <div>
        {timer ? (
          <button onClick={stopTimer} style={{ marginRight: 8 }}>
            Stop
          </button>
        ) : (
          <button onClick={startTimer} style={{ marginRight: 8 }}>
            Start
          </button>
        )}
        <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
          Delete
        </button>
      </div>
    </li>
  );
}
