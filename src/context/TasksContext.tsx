import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, PlannedTask, DoingTask, CompletedTask } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<PlannedTask, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  assignUserToTask: (taskId: string, userId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskInApi = async (updatedTask: Task) => {
    const res = await fetch(`${API_URL}/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    if (res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    }
  };

  const assignUserToTask = async (taskId: string, userId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const { id, name, description, priority, storyId, estimatedTime, createdAt } = task;

    const updatedTask: DoingTask = {
      id,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      createdAt,
      status: 'Doing',
      ownerId: userId,
      startedAt: new Date().toISOString(),
    };

    await updateTaskInApi(updatedTask);
  };

  const completeTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status !== 'Doing') return;

    const updatedTask: CompletedTask = {
      ...task,
      status: 'Completed',
      finishedAt: new Date().toISOString(),
    };

    await updateTaskInApi(updatedTask);
  };

  const addTask = async (taskData: any) => {
    const newTask: PlannedTask = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'Planned',
      createdAt: new Date().toISOString(),
    };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (res.ok) setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = async (id: string, updates: any) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, loading, addTask, updateTask, deleteTask, 
      assignUserToTask, completeTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};