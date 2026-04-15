import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Task, PlannedTask, DoingTask, CompletedTask } from "../types/task";
import { tasksService } from "../services/tasksService";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<PlannedTask, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  updateTaskInApi: (updatedTask: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  assignUserToTask: (taskId: string, userId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Fetch tasks failed:", err);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  const updateTaskInApi = async (updatedTask: Task) => {
    const savedTask = await tasksService.updateTask(updatedTask.id, updatedTask);
    setTasks((prev) => prev.map((task) => (task.id === savedTask.id ? savedTask : task)));
  };

  const assignUserToTask = async (taskId: string, userId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const { id, name, description, priority, storyId, estimatedTime, createdAt, position } = task;

    const updatedTask: DoingTask = {
      id,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      createdAt,
      position,
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
    const { id: _id, ...taskRequest } = newTask;
    const savedTask = await tasksService.createTask(taskRequest);
    setTasks((prev) => [...prev, savedTask]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const savedTask = await tasksService.updateTask(id, updates);
    setTasks((prev) => prev.map((task) => (task.id === savedTask.id ? savedTask : task)));
  };

  const deleteTask = async (id: string) => {
    await tasksService.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      isLoading,
      hasLoaded,
      error,
      loadTasks,
      addTask, 
      updateTask, 
      updateTaskInApi,
      deleteTask, 
      assignUserToTask, 
      completeTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider');
  return context;
};