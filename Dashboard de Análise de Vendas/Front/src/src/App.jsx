import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';

const API = 'http://localhost:4000/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title, description) => {
    const res = await axios.post(API, { title, description });
    setTasks([res.data, ...tasks]);
  };

  const updateTime = async (id, seconds) => {
    await axios.patch(`${API}/${id}/time`, { timeSpent: seconds });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Tracker with Time Tracking</h1>
      <AddTask onAdd={addTask} />
      <TaskList tasks={tasks} onUpdateTime={updateTime} onDelete={deleteTask} />
    </div>
  );
}
